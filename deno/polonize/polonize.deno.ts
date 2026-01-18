// deno run --allow-read --allow-write fix-subtitles.ts [ścieżka_katalogu]
// domyślnie bierze bieżący katalog ('.')
const ROOT = Deno.args[0] ?? '.';
const EXTENSIONS = new Set(['txt', 'srt']);

/// REPLACEMENTS

// const replacements: [RegExp, string][] = [
//   // lowercase
//   [/¹/g, 'ą'],
//   [/¿/g, 'ż'],
//   [/œ/g, 'ś'],
//   [/Ÿ/g, 'ź'],
//   [/ê/g, 'ę'],
//   [/æ/g, 'ć'],
//   [/ô/g, 'ó'],
//   [/³/g, 'ł'],
//   [/ñ/g, 'ń'],
//   // uppercase
//   [/¥/g, 'Ą'],
//   [/¯/g, 'Ż'],
//   [/Œ/g, 'Ś'],
//   [//g, 'Ź'],
//   [/Ê/g, 'Ę'],
//   [/Æ/g, 'Ć'],
//   [/Ô/g, 'Ó'],
//   [/£/g, 'Ł'],
//   [/Ñ/g, 'Ń'],

//   // cleanup
//   [/\{\\an\d\}/g, ''],
//   [/<\/?i>/g, ''],
// ] as const;

// const isSimpleChar = (regex: RegExp): boolean => {
//   const src = regex.source;
//   return src.length === 1 || (src.length === 2 && src[0] === '\\');
// };

const replacements: Record<string, string> = {
  // lowercase
  '¹': 'ą',
  '¿': 'ż',
  œ: 'ś',
  Ÿ: 'ź',
  ê: 'ę',
  æ: 'ć',
  '³': 'ł',
  ñ: 'ń',

  // uppercase
  '¥': 'Ą',
  '¯': 'Ż',
  Œ: 'Ś',
  '': 'Ź',
  Ê: 'Ę',
  Æ: 'Ć',
  '£': 'Ł',
  Ñ: 'Ń',
};
const replacementsKeys = Object.keys(replacements).join('');
const replacementsRegExp = new RegExp(`[${replacementsKeys}]`, 'g');
// console.log({ replacementsRegExp });

//<i>Dwóch najbardziej niesamowitych<
//tancerzy jakich kiedykolwiek widziałem.</i>

// const cleanupRegExp = /\{[^}]*\}|<[^>]+>|\uFEFF/gi;
// const cleanupRegExp = /\{(?!\d+\})[^}]*\}|<[^>]+>|\uFEFF/gi;
// const cleanupRegExp = /\{(?!\d+\})[^}]*\}|<(?:[\r\n]+|[^<>]*>)|\uFEFF/gi;
const cleanupRegExp = /\{(?!\d+\})[^}]*\}|<(?=[\r\n])|<[^<>]*>|\uFEFF/gi;

const applyReplacements = (s: string) => {
  replacementsRegExp.lastIndex = 0;
  cleanupRegExp.lastIndex = 0;

  if (!replacementsRegExp.test(s) && !cleanupRegExp.test(s))
    return { result: s, hadReplacements: false };

  replacementsRegExp.lastIndex = 0;
  cleanupRegExp.lastIndex = 0;

  const result = s
    .replace(replacementsRegExp, match => replacements[match] ?? match)
    // { } to tag pozycjonowania z formatu napisów ASS/SSA (Advanced SubStation Alpha).
    // < > to tag HTML
    // \uFEFF to Zero Width No-Break Space
    .replace(cleanupRegExp, match => {
      console.log('[ CLEANUP ]', JSON.stringify(match));
      return '';
    });
  return { result, hadReplacements: result !== s };
};

/// PROCESS DIRECTORY

const subtitlesFiles: string[] = [];

for (const dirEntry of Deno.readDirSync(ROOT)) {
  if (dirEntry.isFile) {
    const fileExtension = dirEntry.name.slice(dirEntry.name.lastIndexOf('.') + 1).toLowerCase();
    if (EXTENSIONS.has(fileExtension)) subtitlesFiles.push(dirEntry.name);
  }
}

const fileExists = async (path: string): Promise<boolean> => {
  try {
    await Deno.stat(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return false;
    throw err;
  }
};

// const score = (s: string, r: RegExp) => {
//   const m = s.match(r);
//   return m ? m.length : 0;
// };
const countMatches = (s: string, r: RegExp) => (s.match(r) ?? []).length;

const tryDecode = (u8: Uint8Array, encoding: string): string | null => {
  try {
    // fatal: true -> jeśli strumień nie jest poprawny w danym kodowaniu, poleci wyjątek
    return new TextDecoder(encoding, { fatal: true }).decode(u8);
  } catch {
    return null;
  }
};

// Check BOM (Byte Order Mark)
const hasBOM = (u8: Uint8Array) => {
  if (u8.length >= 3 && u8[0] === 0xef && u8[1] === 0xbb && u8[2] === 0xbf)
    return { enc: 'utf-8', drop: 3 as const };
  if (u8.length >= 2 && u8[0] === 0xff && u8[1] === 0xfe)
    return { enc: 'utf-16le', drop: 0 as const };
  if (u8.length >= 2 && u8[0] === 0xfe && u8[1] === 0xff)
    return { enc: 'utf-16be', drop: 0 as const };
  return null;
};

/// DETECT AND DECODE

const ENCODINGS = [
  'windows-1250',
  'windows-1252',
  'iso-8859-1',
  'iso-8859-2',
  'utf-8',
  'utf-8-sig',
  'cp852',
  'ibm852',
  'cp437',
  'macintosh',
  'x-mac-ce',
  'mazovia',
  'iso-ir-197',
] as const;

const smartDecode = (
  raw: Uint8Array,
): {
  result: string;
  encoding: string;
  hadReplacements: boolean;
  meta?: object;
} => {
  // BOM
  const bom = hasBOM(raw);
  if (bom) {
    const text = new TextDecoder(bom.enc).decode(raw.subarray(bom.drop));
    const { result, hadReplacements } = applyReplacements(text);

    return {
      result,
      encoding: `${bom.enc} (BOM${bom.drop ? '' : ' none'})`,
      hadReplacements,
    };
  }

  // Scores
  type Score = { id: number; enc: string; pl: number; mj: number };
  const scores: Score[] = [];

  for (const [id, enc] of ENCODINGS.entries()) {
    const text = tryDecode(raw, enc);
    // == null (loose equality) matches BOTH null AND undefined
    // === null (strict equality) matches ONLY null (not undefined)
    if (text == null) continue;

    // celowo bez ó/Ó
    const pl = countMatches(text, /[ąćęłńśżźĄĆĘŁŃŚŻŹ]/g);
    const mj = countMatches(text, replacementsRegExp);

    scores.push({ id, enc, pl, mj });
  }

  if (scores.length > 0) {
    // best
    // const bestPL = scores.sort((a, b) => b.pl - a.pl)[0];
    // const bestPL = scores.toSorted((a, b) => b.pl - a.pl)[0];
    const bestPL = scores.reduce((best, curr) => (curr.pl > best.pl ? curr : best));
    const bestMJ = scores.reduce((best, curr) => (curr.mj > best.mj ? curr : best));

    const meta = {
      scores,
      bestPL,
      bestMJ,
    };

    if (bestPL.pl >= bestMJ.mj) {
      const text = new TextDecoder(bestPL.enc).decode(raw);
      const { result, hadReplacements } = applyReplacements(text);
      return {
        result,
        encoding: bestPL.enc,
        hadReplacements,
        meta: { ...meta, if: 'bestPL.pl > bestMJ.mj' },
      };
    } else if (bestMJ.mj > bestPL.pl) {
      const text = new TextDecoder(bestMJ.enc).decode(raw);
      const { result, hadReplacements } = applyReplacements(text);
      return {
        result,
        encoding: bestMJ.enc,
        hadReplacements,
        meta: { ...meta, if: 'bestMJ.mj > bestPL.pl' },
      };
    } else {
      const { result: resultPL, hadReplacements: hadReplacementsPL } = applyReplacements(
        new TextDecoder(bestPL.enc).decode(raw),
      );
      const { result: resultMJ, hadReplacements: hadReplacementsMJ } = applyReplacements(
        new TextDecoder(bestMJ.enc).decode(raw),
      );

      const pl = countMatches(resultPL, /[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/g);
      const mj = countMatches(resultMJ, /[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/g);

      if (pl >= mj)
        return {
          result: resultPL,
          encoding: bestPL.enc,
          hadReplacements: hadReplacementsPL,
          meta: { ...meta, if: 'pl > mj' },
        };
      else
        return {
          result: resultMJ,
          encoding: bestMJ.enc,
          hadReplacements: hadReplacementsMJ,
          meta: { ...meta, if: 'else' },
        };
    }
  }

  // fallback
  const text = new TextDecoder('utf-8').decode(raw);
  const { result, hadReplacements } = applyReplacements(text);
  return { result, encoding: 'utf-8 (fallback)', hadReplacements, meta: { if: 'fallback' } };
};

/// Process files

for (const path of subtitlesFiles) {
  if (await fileExists(path + '.bak')) {
    console.log('[  SKIP  ] file exists:', path + '.bak');
    continue;
  }

  const raw = await Deno.readFile(path);

  // Skip empty files
  if (raw.length === 0) {
    console.log('[  SKIP  ] empty file:', path);
    continue;
  }

  const { result, encoding, hadReplacements, meta } = smartDecode(raw);

  // Skip whitespace-only files
  if (result.trim().length === 0) {
    console.log('[  SKIP  ] whitespace-only file:', path);
    continue;
  }

  if (!hadReplacements && encoding.startsWith('utf-8')) {
    console.log('[  SKIP  ] no replacements and encoding utf-8:', path);
    continue;
  }

  console.log({ path, encoding, hadReplacements, meta });

  // backup
  await Deno.copyFile(path, path + '.bak');

  // save as UTF-8 (no BOM)
  const u8 = new TextEncoder().encode(result);
  await Deno.writeFile(path, u8);
}

console.log('File(s) processed and saved.');
