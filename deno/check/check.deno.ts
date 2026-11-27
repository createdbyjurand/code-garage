// deno-lint-ignore-file no-unversioned-import

import { z } from 'npm:zod';
import * as cheerio from 'npm:cheerio';

/// CONFIG

export const path = Deno.args.find(arg => !arg.startsWith('-')) ?? './';
const watch = Deno.args.includes('--watch');
export const urlExtensions = Object.freeze(new Set(['url']));
export const bayCategories: Record<number, string> = {
  0: 'All',
  207: 'HD - Movies',
  208: 'HD - TV shows',
};
const thisYear = new Date().getFullYear().toString();
const previousYear = `${+thisYear - 1}`;
const nextYear = `${+thisYear + 1}`;

// openSubtitles
const openSubtitlesPrecompiledRegExpErrorMessages: [RegExp, string][] = [];
const openSubtitlesErrorMessages: string[] = [
  'NO RESULTS FOUND...',
  'You are not logged in!',
  'Sorry. We have problem with network connection to database server, try reload page.',
  'Enable JavaScript and cookies to continue',
  'Just a moment...',
  'You are seeing this because the administrator of this website has set up Anubis to protect the server against the scourge of AI companies aggressively scraping websites. This can and does cause downtime for the websites, which makes their resources inaccessible for everyone.',
  '404 Not Found',
  'The resource could not be found.',
];
for (const em of openSubtitlesErrorMessages)
  openSubtitlesPrecompiledRegExpErrorMessages.push([new RegExp(em, 'i'), em]);
// openSubtitles cookie
// const _ga = 'GA1.1.1573756632.1771917301';
// const _ga_1D0CX3QS3M = 'GS2.1.s1774026969$o11$g1$t1774026990$j39$l0$h0';
const PHPSESSID = 'PSrSb40D3oBePRZUQjr9RufSLBc';
// const pref_mk = '%7B%22tv%22%3A17%2C%22m%22%3A5%7D';
// const cf_clearance =
//   'zMG.Qkl8ArijneQs0DdER2eJB94hMgYczW.szMgHUew-1774028407-1.2.1.1-nL3Y7IjaGbGGWhf.81zLK8RGwD34JDDHP03Upj9e0dyZ6HjW60atnUEZV5BUUSY0qFz3botDH48D.5V7ipJbN.pGA2vXOvMlc7uq7uME9xqar.kBef3C3p_28PpIcjrZnaiT906tezP_xzogTPcqjXC58TOQuTEsZy5HaHywCWvckmN8HNKE.s0k8eEmGNt0.Qfx_.Uksrkqmv9cAAUFqaII8BvLa6oBlT5oweLdbQm9mzRU5JNzA.FYD6j0yEtt';
// const remember_sid = 'q1u1mL%2CReQuf9urNfLiiig1gUEc';
// const _GRECAPTCHA =
//   '09AKhCRwiQTjRNVc1MxDD7B7rPWhbWm5HwgqyWtnQaC5uhjZNF3Di79uB-brVJEXg0CSidKF5okXI27VE-8fEfOo4';
const techaroLolAnubisAuth =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhY3Rpb24iOiJDSEFMTEVOR0UiLCJjaGFsbGVuZ2UiOiIwMTlkYTkyMy1iZDFiLTdhNjctOGE1My04N2M5ZmZiMDJjZDEiLCJleHAiOjE3NzcyNjM5ODUsImlhdCI6MTc3NjY1OTE4NSwibWV0aG9kIjoiZmFzdCIsIm5iZiI6MTc3NjY1OTEyNSwicG9saWN5UnVsZSI6Ijg0ZmQ4ZDdmMmM0MjAwNDgiLCJyZXN0cmljdGlvbiI6IjQ4OGYyNjgzZmViMmNkMzZiY2FkY2EwZmY1Y2I2NTcwMGRmZWFhY2JkM2I3MzU0YmEzZDVlYzdkYWFlMDgzMWYifQ.lvs2WBZcfwGQeebI5xW9R93bBjoYEObrELi-uXH1GEkUneDl6-8DVzN4lJ6BbT_1QwWjT3pTaoVbQL5vmpJ-Cw';
const techaroLolAnubisCookieVerification = '019da923-be4e-7ad0-aa51-09dd3d75bdbf';

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

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
const randomSeconds = (min: number, max: number): number =>
  min + Math.floor(Math.random() * (max - min + 1));
const formatTime = (ms: number): string => {
  const seconds = Math.ceil(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [hours, minutes, seconds % 60].map(value => value.toString().padStart(2, '0')).join(':');
};
const clearWatchStatus = (): void => {
  if (watch) Deno.stdout.writeSync(new TextEncoder().encode('\x1b[2K\r'));
};
const writeWatchStatus = (next?: number): void => {
  const color = newItems.size > 0 || lastCycleNewItems > 0 ? ansiColor.red : ansiColor.green;
  if (watch)
    Deno.stdout.writeSync(
      new TextEncoder().encode(
        // Max 77 chars
        `[   ${color}WATCH${ansiColor.reset}   ] Cycle: ${color}${cycle}${ansiColor.reset} | Request: ${color}${requestNumber}${ansiColor.reset}/${color}${requestTotal}${ansiColor.reset} | New: ${color}${newItems.size}${ansiColor.reset} | Last: ${color}${lastCycleNewItems}${ansiColor.reset}${next === undefined ? '' : ` | Next: ${color}${formatTime(next)}${ansiColor.reset}`}`,
      ),
    );
};
const waitWatch = async (minSeconds: number, maxSeconds: number): Promise<void> => {
  const end = Date.now() + randomSeconds(minSeconds, maxSeconds) * 1000;
  while (true) {
    const remaining = end - Date.now();
    if (remaining <= 0) break;
    clearWatchStatus();
    writeWatchStatus(remaining);
    await wait(Math.min(1000, remaining));
  }
  clearWatchStatus();
};
const waitBetweenRequests = (): Promise<void> => (watch ? waitWatch(1, 540) : Promise.resolve());
const waitBetweenCycles = (): Promise<void> => (watch ? waitWatch(540, 5400) : Promise.resolve());

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

const getFilePath = (urlFileName: string): string =>
  `${path.replace(/[\\/]$/, '')}\\${urlFileName}`;

export let urlFileNames: string[] = [];

const readUrlFileNames = (): string[] =>
  [...Deno.readDirSync(path)]
    .filter(
      dirEntry =>
        dirEntry.isFile &&
        urlExtensions.has(dirEntry.name.slice(dirEntry.name.lastIndexOf('.') + 1).toLowerCase()),
    )
    .map(dirEntry => dirEntry.name)
    .sort();

/// CHECK

// https://thepiratebay.org/search.php?q=Star+Trek+Starfleet+Academy+1080*&cat=0
// https://apibay.org/q.php?q=Star%20Trek%20Starfleet%20Academy%201080*&cat=0

const seenHashes = new Set<string>();
const newItems = new Map<string, PirateBayItem>();
let lastCycleNewItems = 0;
let cycle = 0;
let requestNumber = 0;
let requestTotal = 0;

do {
  urlFileNames = readUrlFileNames();
  cycle++;
  requestTotal = urlFileNames.length;
  requestNumber = 0;
  for (const [requestIndex, urlFileName] of urlFileNames.entries()) {
    requestNumber = requestIndex + 1;
    clearWatchStatus();
    let urlFile: string;
    try {
      urlFile = Deno.readTextFileSync(getFilePath(urlFileName));
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) continue;
      throw err;
    }
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
            .replace(/!\([^\)]+\)/g, '')
            .split(/[^a-zA-Z0-9!]/)
            .filter(e => [/1080|![a-zA-Z0-9]+/].some(re => !re.test(e)))
            .join(' ')
            .trim();
          if (fileWords !== qWords) {
            console.warn(
              ansiColor.yellow + '[ PIRATEBAY ] FILENAME AND Q MISMATCH',
              ansiColor.reset,
            );
            console.warn(ansiColor.yellow + '    filename:', urlFileName, ansiColor.reset);
            console.warn(ansiColor.yellow + '        └─ q:', qWords, ansiColor.reset);
          }
        }
        const urls = ['https://apibay.org/q.php?' + params.toString().replaceAll('+', '%20')];
        if (cat && (+cat === 0 || +cat === 207) && !/s\d{2}[^a-z0-9]?e(?!00)\d{2}/i.test(q)) {
          if (q.includes(previousYear)) {
            urls.push(urls[0].replace(previousYear, thisYear));
            urls.sort();
          } else if (q.includes(thisYear)) {
            urls.push(urls[0].replace(thisYear, previousYear));
            urls.push(urls[0].replace(thisYear, nextYear));
            urls.sort();
          } else if (q.includes(nextYear)) {
            urls.push(urls[0].replace(nextYear, thisYear));
            urls.sort();
          }
        }
        const isEpisodeZero = q.match(/[^a-zA-Z1-9]s\d+e(\d+)[^a-zA-Z0-9]/i)?.[1]?.trim() === '00';
        if (isEpisodeZero) {
          const starURL = urls[0].replace(/([^a-zA-Z1-9]s\d+)e00([^a-zA-Z0-9])/i, '$1*$2');
          // console.log('Adding URL:', starURL);
          urls.push(starURL);
          urls.sort();
        }
        for (const u of urls)
          try {
            const currentQ = new URL(u).searchParams.get('q');
            if (!currentQ) continue;
            clearWatchStatus();
            console.log('[ PIRATEBAY ]', currentQ, cat ? '( ' + bayCategories[+cat] + ' )' : '');
            if (q.split(/\s+/).length > 8) {
              console.warn(
                ansiColor.yellow +
                  // '[ PIRATEBAY ]' +
                  '              └─ Warning: search query too long (apibay returns no results for q with more than 8 params)',
                ansiColor.reset,
              );
            }
            try {
              if (Deno.readTextFileSync(getFilePath(urlFileName)) !== urlFile) continue;
            } catch (err) {
              if (err instanceof Deno.errors.NotFound) continue;
              throw err;
            }
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
            // console.log('Status:', res.status);
            const parsed = PirateBayResponseSchema.safeParse(json);
            if (parsed.success) {
              const items = parsed.data
                .filter(
                  (d: PirateBayItem) => d.status === 'vip' || d.status === 'trusted',
                  // && isSeries === isSeriesRegExp.test(d.name),
                )
                .sort(
                  (a: PirateBayItem, b: PirateBayItem) =>
                    Number(b.added ?? 0) - Number(a.added ?? 0),
                );
              for (const item of items) {
                if (!seenHashes.has(item.info_hash) && !newItems.has(urlFileName))
                  newItems.set(urlFileName, item);
                seenHashes.add(item.info_hash);
              }
              clearWatchStatus();
              const data = items
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
              Object.keys(data).length !== 0 && console.table(data);
            } else {
              console.error(
                ansiColor.red + '[ PIRATEBAY ] Unexpected response:',
                json,
                ansiColor.reset,
              );
            }
          } catch (err) {
            console.error(ansiColor.red + '[ PIRATEBAY TRY CATCH ERROR ]', err, ansiColor.reset);
          } finally {
            if (watch) {
              clearWatchStatus();
              await waitBetweenRequests();
            }
          }
      } else if (url.includes('opensubtitles')) {
        clearWatchStatus();
        console.log(
          '[ OPENSUBTITLES ]',
          url
            .slice(url.indexOf('/moviename-') + 11, url.indexOf('/sublanguageid-'))
            .replaceAll('+', ' '),
        );

        try {
          // const cookie =
          //   /* ts */
          //   `
          //     PHPSESSID = hlPTB%2CK0nD8MgzEj5EsNTYUSvFb;
          //     cf_clearance = H3E4D1OH7ZQZ6KqJN2cXkdX8Gz5Y0YafRhesIn65F5o-1771759477-1.2.1.1-GE59aRqru892oi1rOKEbuQvNcWOSortu.gkd.TLmnirsVOhl5bOonCHuq77HrKOn2NaBdy.irtXkPG0X3.oCWhJK2L0illXcITYEVd6UMRJac7wC1rLHfSLX3IJ4bvt4HciVcLFQbQn4r_c__cnRhgMq1owZIO6voVZm.ykimvM310N6bh9KgLNWtKvifktIf27yfDdrkjFz2GRshsIeCB9FHna2xhQTnqnPf0g8vj8;
          //     logged = 1;
          //     remember_sid=hlPTB%2CK0nD8MgzEj5EsNTYUSvFb;
          //     server = 1;
          //     user = createdbyjurand;
          //     weblang = en;
          //   `;

          // Record<key, URL_ENCODED_VALUE>
          // %2C (URL-Encoded Comma)
          // %20 (URL-Encoded Space)

          type OpenSubtitlesCookie = {
            _ga: string;
            _ga_1D0CX3QS3M: string;
            // _GRECAPTCHA: token od reCAPTCHA do weryfikacji captcha,
            _GRECAPTCHA: string;
            // cf_clearance: cloudflare potwierdzające przejście zadania antybotowego
            cf_clearance: string;
            GL_GI10: string;
            GL_UI4: string;
            logged: string | number;
            OAGEO: string;
            OAID: string;
            // PHPSESSID: główny identyfikator bieżącej sesji logowania
            PHPSESSID: string;
            pref_mk: string;
            rauid: string;
            // remember_sid: token pozwalający serwisowi odtworzyć nową sesję po wygaśnięciu PHPSESSID
            remember_sid: string;
            searchform: string;
            server: string | number;
            user: string;
            weblang: string;
            'techaro.lol-anubis-auth': string;
            'techaro.lol-anubis-cookie-verification': string;
          };

          const openSubtitlesCookie: Partial<OpenSubtitlesCookie> = {
            // _ga,
            // _ga_1D0CX3QS3M,
            // cf_clearance,
            // logged: 1,
            PHPSESSID,
            // pref_mk,
            // remember_sid,
            // server: 1,
            // user: 'createdbyjurand',
            // weblang: 'en',
            // _GRECAPTCHA,
            'techaro.lol-anubis-auth': techaroLolAnubisAuth,
            'techaro.lol-anubis-cookie-verification': techaroLolAnubisCookieVerification,
          };

          const cookie = Object.entries(openSubtitlesCookie)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

          const headers = { cookie };

          const res = await fetch(url, { headers });
          // const res = await fetch(url);
          const html = await res.text();

          const firstMatch = openSubtitlesPrecompiledRegExpErrorMessages.find(([regex]) =>
            regex.test(html),
          );

          if (firstMatch) {
            console.error(ansiColor.red + '                  └─', firstMatch[1], ansiColor.reset);
            // console.error(ansiColor.red + '[ OPENSUBTITLES ]', firstMatch[1], ansiColor.reset);
          } else if (/<table id="search_results">/.test(html)) {
            console.log(ansiColor.yellow + '[ OPENSUBTITLES ] Found! :)' + ansiColor.reset);
            const $ = cheerio.load(html);
            const titles = $('#search_results tr td:nth-child(2)')
              .map((_, el) =>
                $(el) //
                  .text()
                  .replace(/oglądaj na żywo|"|'/gi, '')
                  .replace(/([)\]}])([^\s])/g, '$1 $2')
                  .replace(/\s+/g, ' ')
                  .trim(),
              )
              .get()
              .filter(Boolean);
            console.log(titles);
          } else {
            console.log(ansiColor.yellow + '[ OPENSUBTITLES ] Maybe... :)' + ansiColor.reset, html);
          }
        } catch (err) {
          console.error(ansiColor.red + '[ OPENSUBTITLES TRY CATCH ERROR ]', err, ansiColor.reset);
        } finally {
          if (watch) {
            clearWatchStatus();
            await waitBetweenRequests();
          }
        }
      } else console.error(ansiColor.red + '[ IF URL ERROR ]', urlFileName, ansiColor.reset);
  }

  if (watch) {
    clearWatchStatus();
    if (newItems.size)
      console.table(
        [...newItems.values()].map(item => ({
          name: item.name,
          added: new Date(Number(item.added) * 1000).toLocaleString('sv-SE'),
          seeders: item.seeders,
        })),
      );
    lastCycleNewItems = newItems.size;
    newItems.clear();
    await waitBetweenCycles();
  }
} while (watch);
