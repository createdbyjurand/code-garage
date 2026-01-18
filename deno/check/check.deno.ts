// deno-lint-ignore-file no-unversioned-import

import { z } from 'npm:zod';
import * as cheerio from 'npm:cheerio';

/// CONFIG

export const path = Deno.args[0] ?? './';
export const urlExtensions = Object.freeze(new Set(['url']));
export const bayCategories: Record<number, string> = {
  0: 'All',
  207: 'HD - Movies',
  208: 'HD - TV shows',
};
const thisYear = new Date().getFullYear().toString();
const previousYear = (new Date().getFullYear() - 1).toString();

// openSubtitles
const openSubtitlesPrecompiledRegExpErrorMessages: [RegExp, string][] = [];
const openSubtitlesErrorMessages: string[] = [
  'NO RESULTS FOUND...',
  'You are not logged in!',
  'Sorry. We have problem with network connection to database server, try reload page.',
];
for (const em of openSubtitlesErrorMessages)
  openSubtitlesPrecompiledRegExpErrorMessages.push([new RegExp(em, 'i'), em]);

// apiBay
const apiBayPrecompiledRegExpErrorMessages: [RegExp, string][] = [];
const apiBayErrorMessages: string[] = [
  'Database maintenance, please check back in 10 minutes.',
  'apibay.org | 502: Bad gateway',
];
for (const em of apiBayErrorMessages)
  apiBayPrecompiledRegExpErrorMessages.push([new RegExp(em, 'i'), em]);

const ansiColor = {
  //
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

/// ZOD

const PirateBayItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  info_hash: z.string(),
  leechers: z.string(),
  seeders: z.string(),
  size: z.string(),
  num_files: z.string(),
  username: z.string(),
  added: z.string(),
  status: z.string(),
  category: z.string(),
  imdb: z.string(),
  total_found: z.string().optional(),
});
type PirateBayItem = z.infer<typeof PirateBayItemSchema>;

const PirateBayResponseSchema = z.array(PirateBayItemSchema);
type PirateBayResponse = z.infer<typeof PirateBayResponseSchema>;

/// HELPER FUNCTIONS

export const parseURL = (url: string): string =>
  'https://apibay.org/q.php' + url.slice(url.indexOf('?q=')).replaceAll('+', '%20');

/// DESTRUCTURE DIRECTORY FILES

export const urlFileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path))
  if (dirEntry.isFile)
    if (urlExtensions.has(dirEntry.name.slice(dirEntry.name.lastIndexOf('.') + 1).toLowerCase()))
      urlFileNames.push(dirEntry.name);

urlFileNames.sort();

/// CHECK

// https://thepiratebay.org/search.php?q=Star+Trek+Starfleet+Academy+1080*&cat=0
// https://apibay.org/q.php?q=Star%20Trek%20Starfleet%20Academy%201080*&cat=0

for (const urlFileName of urlFileNames) {
  const urlFile = Deno.readTextFileSync(urlFileName);
  const url = urlFile.match(/^URL=(.+)$/m)?.[1]?.trim();
  if (url)
    if (url.includes('thepiratebay') || url.includes('apibay')) {
      const params = new URL(url).searchParams;
      const cat = params.get('cat');
      const q = params.get('q');
      if (!q) continue;
      const isSeriesRegExp =
        /[^a-zA-Z0-9]s\d+e\d+[^a-zA-Z0-9]|[^a-zA-Z0-9]s\d+[^a-zA-Z0-9]|season/i;
      const isSeries = isSeriesRegExp.test(q ?? '');
      if (!isSeries) {
        const fileWords = urlFileName
          .toLowerCase()
          .split(/[^a-zA-Z0-9]/)
          .filter(e => [/url/].some(re => !re.test(e)))
          .join(' ')
          .trim();
        const qWords = q
          .toLowerCase()
          .split(/[^a-zA-Z0-9]/)
          .filter(e => [/1080?./].some(re => !re.test(e)))
          .join(' ')
          .trim();
        if (fileWords !== qWords) {
          console.warn(ansiColor.yellow + '[ PIRATEBAY ] FILENAME AND Q MISMATCH', ansiColor.reset);
          console.warn(ansiColor.yellow + '    filename:', urlFileName, ansiColor.reset);
          console.warn(ansiColor.yellow + '        └─ q:', qWords, ansiColor.reset);
        }
      }
      const urls = ['https://apibay.org/q.php?' + params.toString().replaceAll('+', '%20')];
      if (
        cat &&
        (+cat === 0 || +cat === 207) &&
        q &&
        (q.includes(thisYear) || q.includes(previousYear))
      ) {
        urls.push(
          urls[0].includes(thisYear)
            ? urls[0].replace(thisYear, previousYear)
            : urls[0].replace(previousYear, thisYear),
        );
        urls.sort();
      }
      for (const u of urls)
        try {
          const currentQ = new URL(u).searchParams.get('q');
          console.log('[ PIRATEBAY ]', currentQ, cat ? '( ' + bayCategories[+cat] + ' )' : '');
          const res = await fetch(u);
          // console.log('[ PIRATEBAY ]', { u, res });
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            const html = await res.text();
            const firstMatch = apiBayPrecompiledRegExpErrorMessages.find(([regex]) =>
              regex.test(html),
            );
            if (firstMatch) {
              console.error(ansiColor.red + '              └─', firstMatch[1], ansiColor.reset);
            } else {
              console.error(ansiColor.red + '[ APIBAY UNKNOWN ERROR ]', html, ansiColor.reset);
            }
            continue;
          }
          const json = await res.json();
          const parsed = PirateBayResponseSchema.safeParse(json);
          if (parsed.success) {
            const data = parsed.data
              .filter(
                (d: PirateBayItem) => d.status === 'vip' || d.status === 'trusted',
                // && isSeries === isSeriesRegExp.test(d.name),
              )
              .sort(
                (a: PirateBayItem, b: PirateBayItem) => Number(b.added ?? 0) - Number(a.added ?? 0),
              )
              // .map((d: PirateBayItem) => [
              //   new Date(d.added * 1000).toLocaleString('sv-SE'),
              //   d.name,
              //   d.seeders,
              // ])
              .reduce(
                (acc: Record<string, { name: string; seeders: string }>, d: PirateBayItem) => {
                  acc[new Date(Number(d.added) * 1000).toLocaleString('sv-SE')] = {
                    name: d.name,
                    seeders: d.seeders,
                  };
                  return acc;
                },
                {},
              );
            console.table(data);
          } else {
            console.error(
              ansiColor.red + '[ PIRATEBAY ] Unexpected response:',
              json,
              ansiColor.reset,
            );
          }
        } catch (err) {
          console.error(ansiColor.red + '[ PIRATEBAY TRY CATCH ERROR ]', err, ansiColor.reset);
        }
    } else if (url.includes('opensubtitles')) {
      console.log(
        '[ OPENSUBTITLES ]',
        url
          .slice(url.indexOf('/moviename-') + 11, url.indexOf('/sublanguageid-'))
          .replaceAll('+', ' '),
      );
      try {
        const res = await fetch(url);
        const html = await res.text();

        const firstMatch = openSubtitlesPrecompiledRegExpErrorMessages.find(([regex]) =>
          regex.test(html),
        );

        if (firstMatch) {
          console.error(ansiColor.red + '                  └─', firstMatch[1], ansiColor.reset);
          // console.error(ansiColor.red + '[ OPENSUBTITLES ]', firstMatch[1], ansiColor.reset);
        } else {
          console.log(ansiColor.yellow + '[ OPENSUBTITLES ] Maybe... :)' + ansiColor.reset);
          const $ = cheerio.load(html);
          const titles = $('#search_results tr td:nth-child(2)')
            .map((_, el) =>
              $(el) //
                .text()
                .replace(/oglądaj na żywo/gi, '')
                .replace(/\s+/g, ' ')
                .trim(),
            )
            .get()
            .filter(Boolean);
          console.log(titles);
        }
      } catch (err) {
        console.error(ansiColor.red + '[ OPENSUBTITLES TRY CATCH ERROR ]', err, ansiColor.reset);
      }
    } else console.error(ansiColor.red + '[ IF URL ERROR ]', urlFileName, ansiColor.reset);
}
