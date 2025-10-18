export const path = './';

export const rename = (fileName: string, newFileName: string, message: string): void => {
  try {
    if (fileName !== newFileName) {
      console.log(' ');
      console.log(`┌─ ${message} START`);
      console.log('|', fileName);
      console.log('|', newFileName);
      Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
      console.log(`└─ ${message} END`);
    }
  } catch (err) {
    console.error(`Error renaming ${fileName}:`, err);
  }
};

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) rename(dirEntry.name, dirEntry.name.toLowerCase(), 'RENAME TO LOWERCASE');
}

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile)
    rename(dirEntry.name, dirEntry.name.split(' ').join('.'), 'RENAME SPACES TO DOTS');
}

export const fileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) dirEntry.isFile && fileNames.push(dirEntry.name);

fileNames.sort();

export const EPISODE_REGEXP = /[^s\d]\d\d\./;
export const SEASON_EPISODE_REGEXP = /\.s\d\de\d\d\./;

export const slicePrefix = (
  fileName: string,
  regexp: RegExp,
  changeStart = 0,
  changeEnd = 0,
): string => fileName.slice(0 + changeStart, fileName.search(regexp) + changeEnd);

export const sliceString = (fileName: string, regexp: RegExp, before = 0, after = 0): string =>
  fileName.slice(fileName.search(regexp) + before, fileName.search(regexp) + after);

export const sliceNumber = (fileName: string, regexp: RegExp, before = 0, after = 0): number =>
  +sliceString(fileName, regexp, before, after);

fileNames.forEach((fileName, index, array) => {
  if (
    fileName.match(new RegExp(`^.*${SEASON_EPISODE_REGEXP.toString().slice(1, -1)}.*\.url$`)) ||
    fileName.match(new RegExp(`^.*${SEASON_EPISODE_REGEXP.toString().slice(1, -1)}url$`))
  ) {
    const urlPrefix = slicePrefix(fileName, SEASON_EPISODE_REGEXP, 0, 2);
    const urlSeasonNumber = sliceNumber(fileName, SEASON_EPISODE_REGEXP, 2, 4);
    const urlEpisodeNumber = sliceNumber(fileName, SEASON_EPISODE_REGEXP, 5, 7);

    // console.log(' ');
    // console.log(`   ┌ fileName: "${fileName}"`);
    // console.log(`   ┠ urlPrefix: "${urlPrefix}"`);
    // console.log('   ┠ urlSeasonNumber:', urlSeasonNumber);
    // console.log('   └ urlEpisodeNumber:', urlEpisodeNumber);

    let i = index;

    while (
      i + 1 < array.length &&
      urlPrefix === slicePrefix(array[i + 1], SEASON_EPISODE_REGEXP, 0, 2) &&
      urlSeasonNumber === sliceNumber(array[i + 1], SEASON_EPISODE_REGEXP, 2, 4) &&
      urlEpisodeNumber + i - index + 1 === sliceNumber(array[i + 1], SEASON_EPISODE_REGEXP, 5, 7)
    )
      i++;

    if (i > index) {
      console.log(' ');
      console.log('┌─── RENAME SEASON URL START');
      console.log('| ┌─', fileName);
      const newFileName = array[i].slice(0, array[i].lastIndexOf('.')) + '.url';
      let j = index + 1;
      while (
        urlPrefix === slicePrefix(array[j - 1], SEASON_EPISODE_REGEXP, 0, 2) &&
        urlSeasonNumber === sliceNumber(array[j - 1], SEASON_EPISODE_REGEXP, 2, 4) &&
        urlEpisodeNumber <= sliceNumber(array[j - 1], SEASON_EPISODE_REGEXP, 5, 7)
      )
        j--;
      while (j <= i) array[j].endsWith('.url') ? j++ : console.log('| | ', array[j++]);
      console.log('| └>', newFileName);
      Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
      console.log(`└─── RENAME SEASON URL END`);
    }
  } else if (fileName.match(new RegExp(`^.*${EPISODE_REGEXP.toString().slice(1, -1)}.*\.url$`))) {
    const urlPrefix = slicePrefix(fileName, EPISODE_REGEXP, 0, 1);
    const urlEpisodeNumber = sliceNumber(fileName, EPISODE_REGEXP, 1, 3);

    // console.log(' ');
    // console.log(`   ┌ fileName: "${fileName}"`);
    // console.log(`   ┠ urlPrefix: "${urlPrefix}"`);
    // console.log('   └ urlEpisodeNumber:', urlEpisodeNumber);

    let i = index;

    while (
      i + 1 < array.length &&
      urlPrefix === slicePrefix(array[i + 1], EPISODE_REGEXP, 0, 1) &&
      urlEpisodeNumber + i - index + 1 === sliceNumber(array[i + 1], EPISODE_REGEXP, 1, 3)
    )
      i++;

    if (i > index) {
      console.log(' ');
      console.log('┌─── RENAME EPISODE URL START');
      console.log('| ┌─', fileName);
      const newFileName = array[i].slice(0, array[i].lastIndexOf('.')) + '.url';
      let j = index + 1;
      while (
        urlPrefix === slicePrefix(array[j - 1], EPISODE_REGEXP, 0, 1) &&
        urlEpisodeNumber <= sliceNumber(array[j - 1], EPISODE_REGEXP, 1, 3)
      )
        j--;
      while (j <= i) array[j].endsWith('.url') ? j++ : console.log('| | ', array[j++]);
      console.log('| └>', newFileName);
      Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
      console.log(`└─── RENAME EPISODE URL END`);
    }
  }
});

// Rename subtitle file

export const MIN_MATCH_PERCENT = 70;

export const videoExtensions = [
  'mkv',
  'mp4',
  'avi',
  'mpg',
  'mpeg',
  'divx',
  'mov',
  'wmv',
  'flv',
  'webm',
];
export const subtitlesExtensions = ['srt', 'txt'];

export const ignoreInFileName = [
  /^[xh]?264$/i,
  /^[xh]?265$/i,
  /^1$/i,
  /^1080p?$/i,
  /^2160p?$/i,
  /^4$/i,
  /^480p?$/i,
  /^4k$/i,
  /^720p?$/i,
  /^aac5?$/i,
  /^ac3?$/i,
  /^amzn$/i,
  /^atmos$/i,
  /^blu$/i,
  /^bluray$/i,
  /^br$/i,
  /^brrip$/i,
  /^byndr$/i,
  /^ddp5?$/i,
  /^divx$/i,
  /^dl$/i,
  /^dts$/i,
  /^dvd$/i,
  /^dvdrip$/i,
  /^edith$/i,
  /^h$/i,
  /^hd$/i,
  /^hdrip$/i,
  /^hevc$/i,
  /^internal$/i,
  /^k$/i,
  /^mx$/i,
  /^p$/i,
  /^proper$/i,
  /^ray$/i,
  /^repack$/i,
  /^rip$/i,
  /^web$/i,
  /^webdl$/i,
  /^webrip$/i,
  /^x$/i,
  /^xvid$/i,
  /^yts$/i,
];

export const splitRegex = /[^a-zA-Z0-9]+/;

export const extractRelevantWords = (fileName: string): string[] =>
  fileName
    .toLowerCase()
    .split(splitRegex)
    .filter(Boolean)
    .filter(
      word =>
        !ignoreInFileName.some(rx => rx.test(word)) &&
        !videoExtensions.includes(word) &&
        !subtitlesExtensions.includes(word),
    );

export const getMatchPercentage = (aWords: string[], bWords: string[]): number => {
  if (aWords.length === 0 || bWords.length === 0) return 0;

  const aMatches = aWords.filter(word => bWords.includes(word)).length;
  const bMatches = bWords.filter(word => aWords.includes(word)).length;

  const aPercent = (aMatches / aWords.length) * 100;
  const bPercent = (bMatches / bWords.length) * 100;

  return Math.round(Math.min(aPercent, bPercent));
};

export const videoFileNames: string[] = [];
export const subtitlesFileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) {
    const fileExtension = dirEntry.name.slice(dirEntry.name.lastIndexOf('.') + 1);
    if (videoExtensions.includes(fileExtension)) videoFileNames.push(dirEntry.name);
    else if (subtitlesExtensions.includes(fileExtension)) subtitlesFileNames.push(dirEntry.name);
  }
}

// Match subtitles to video files

export const getBaseName = (fileName: string, extensions: string[]) =>
  extensions.some(e => fileName.toLowerCase().endsWith(e.toLowerCase()))
    ? fileName.slice(0, fileName.lastIndexOf('.'))
    : fileName;

export const hasExactMatch = (
  fileName: string,
  fileNames: string[],
  extensions: string[],
): boolean => {
  const baseFileName = getBaseName(fileName, extensions).toLowerCase();
  return fileNames.some(n => getBaseName(n, extensions).toLowerCase() === baseFileName);
};

export const isSameEpisodeInSeries = (aFileName: string, bFileName: string): boolean => {
  const aMatch = aFileName.match(/[^a-zA-Z0-9]+s(?<season>\d\d)e(?<episode>\d\d)[^a-zA-Z0-9]+/i);
  const bMatch = bFileName.match(/[^a-zA-Z0-9]+s(?<season>\d\d)e(?<episode>\d\d)[^a-zA-Z0-9]+/i);

  if (!aMatch?.groups && !bMatch?.groups) return true;
  if (!aMatch?.groups || !bMatch?.groups) return false;

  return (
    aMatch.groups.season === bMatch.groups.season && aMatch.groups.episode === bMatch.groups.episode
  );
};

export const isSamePart = (aFileName: string, bFileName: string): boolean => {
  const pattern =
    /[^a-zA-Z0-9]+(?<part>part|cd|pt|disk)[^a-zA-Z0-9]+(?<numb>(\d+|one|two|three|four|five|six|seven|eight|nine|ten|i|ii|iii|iv|v|vi|vii|viii|ix|x))[^a-zA-Z0-9]+/i;
  const aMatch = aFileName.match(pattern);
  const bMatch = bFileName.match(pattern);

  if (!aMatch?.groups && !bMatch?.groups) return true;
  if (!aMatch?.groups || !bMatch?.groups) return false;

  return aMatch.groups.part === bMatch.groups.part && aMatch.groups.numb === bMatch.groups.numb;
};

export const isValidMatch = (
  reference: string,
  result: string,
  percent: number,
  threshold: number,
): boolean =>
  percent >= threshold && isSameEpisodeInSeries(reference, result) && isSamePart(reference, result);

export const findBestMatch = (
  reference: string,
  candidates: string[],
  threshold: number,
): { result: string; percent: number } | null => {
  const referenceWords = extractRelevantWords(reference);

  const results = candidates
    .map(result => ({
      result,
      percent: getMatchPercentage(referenceWords, extractRelevantWords(result)),
    }))
    .filter(m => isValidMatch(reference, m.result, m.percent, threshold))
    .sort((a, b) => b.percent - a.percent);

  if (results.length === 0) {
    console.log('⚠ No matches:', { reference });
    return null;
  }

  if (results.length > 1 && results[0].percent === results[1].percent) {
    console.log('⚠ Multiple matches:', { reference, results });
    return null;
  }

  return results[0];
};

for (const subtitlesFileName of subtitlesFileNames) {
  const subtitleBaseName = subtitlesFileName.slice(0, subtitlesFileName.lastIndexOf('.'));

  if (hasExactMatch(subtitleBaseName, videoFileNames, [...subtitlesExtensions, ...videoExtensions]))
    continue;

  const match = findBestMatch(subtitlesFileName, videoFileNames, MIN_MATCH_PERCENT);

  if (!match) continue;

  const videoBaseName = match.result.slice(0, match.result.lastIndexOf('.'));

  if (subtitleBaseName !== videoBaseName) {
    const subtitlesWords = extractRelevantWords(subtitlesFileName);
    const videoWords = extractRelevantWords(match.result);
    const subtitlesExtension = subtitlesFileName.slice(subtitlesFileName.lastIndexOf('.'));
    const newSubtitlesFileName = `${videoBaseName}${subtitlesExtension}`;

    if (subtitlesFileNames.includes(newSubtitlesFileName)) {
      console.log('⚠ Cannot rename - subtitles file already exists!');
      continue;
    }

    console.log('Subtitles mismatch');
    console.log('├─ Matched video:', match.result);
    console.log('├─ Subtitles:    ', subtitlesFileName);
    console.log('├─ Subtitle words:', subtitlesWords);
    console.log('├─ Video words:   ', videoWords);
    console.log('└─ Matched percent:', match.percent + '%');

    rename(subtitlesFileName, newSubtitlesFileName, 'RENAMING SUBTITLE');
  }
}
