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

const precompiledRegExpErrorMessages: [RegExp, string][] = [];
const errorMessages: string[] = [
  'NO RESULTS FOUND...',
  'You are not logged in!',
  'Sorry. We have problem with network connection to database server, try reload page.',
];
for (const em of errorMessages) precompiledRegExpErrorMessages.push([new RegExp(em, 'i'), em]);

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

for (const urlFileName of urlFileNames) {
  const urlFile = Deno.readTextFileSync(urlFileName);
  const urlMatch = urlFile.match(/^URL=(.+)$/m);
  const url = urlMatch?.[1]?.trim();
  if (url)
    if (url.includes('thepiratebay') || url.includes('apibay')) {
      const params = new URL(url).searchParams;
      const cat = params.get('cat');
      const q = params.get('q');
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
          const json = await res.json();
          const parsed = PirateBayResponseSchema.safeParse(json);
          if (parsed.success) {
            const data = parsed.data
              .filter((d: PirateBayItem) => d.status === 'vip' || d.status === 'trusted')
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
            console.log('[ PIRATEBAY ] Unexpected response:', json);
          }
        } catch (err) {
          console.log('[ PIRATEBAY TRY CATCH ERROR ]', err);
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

        // const errorMatch = precompiledRegExpErrorMessages.find(([regex]) => regex.test(html));

        if (/NO RESULTS FOUND.../i.test(html)) {
          console.log('[ OPENSUBTITLES ] NO RESULTS FOUND...');
        } else if (/You are not logged in!/i.test(html)) {
          console.log('[ OPENSUBTITLES ] You are not logged in!');
        } else if (
          /Sorry. We have problem with network connection to database server, try reload page./i.test(
            html,
          )
        ) {
          console.log(
            '[ OPENSUBTITLES ] Sorry. We have problem with network connection to database server, try reload page.',
          );
        } else {
          console.log('[ OPENSUBTITLES ] Maybe... :)');
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
        console.log('[ OPENSUBTITLES TRY CATCH ERROR ]', err);
      }
    } else console.log('[ IF URL ERROR ]', urlFileName);
}
