import { z } from 'zod';

/// CONFIG

export const path = Deno.args[0] ?? './';
export const urlExtensions = Object.freeze(new Set(['url']));

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
      console.log(
        '[ PIRATEBAY ]',
        url.slice(url.indexOf('?q=') + 3, url.indexOf('&cat=')).replaceAll('+', ' '),
      );
      try {
        const res = await fetch(
          'https://apibay.org/q.php' + url.slice(url.indexOf('?q=')).replaceAll('+', '%20'),
        );
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
            .reduce((acc: Record<string, { name: string; seeders: string }>, d: PirateBayItem) => {
              acc[new Date(Number(d.added) * 1000).toLocaleString('sv-SE')] = {
                name: d.name,
                seeders: d.seeders,
              };
              return acc;
            }, {});
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
        const data = await res.text();
        if (/NO RESULTS FOUND.../i.test(data)) {
          console.log('[ OPENSUBTITLES ] NO RESULTS FOUND...');
        } else if (/You are not logged in!/i.test(data)) {
          console.log('[ OPENSUBTITLES ] You are not logged in!');
        } else {
          console.log('[ OPENSUBTITLES ] Maybe... :)');
        }
      } catch (err) {
        console.log('[ OPENSUBTITLES TRY CATCH ERROR ]', err);
      }
    } else console.log('[ IF URL ERROR ]', urlFileName);
}
