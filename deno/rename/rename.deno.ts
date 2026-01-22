/// CONFIG

export const path = Deno.args[0] ?? './';

export const MIN_MATCH_PERCENT = 70;

export const videoExtensions = Object.freeze(
  new Set(['mkv', 'mp4', 'avi', 'mpg', 'mpeg', 'divx', 'mov', 'wmv', 'flv', 'webm']),
);

export const subtitlesExtensions = Object.freeze(new Set(['srt', 'txt']));

export const urlExtensions = Object.freeze(new Set(['url']));

/// REGEXP PATTERNS

export const removePatterns: RegExp[] = [
  // ()
  /[^a-zA-Z0-9]*\([^\)]+\)/,
  // []
  /[^a-zA-Z0-9]*\[[^\]]+\]/,
  // -group
  /[^a-zA-Z0-9]*-[^a-zA-Z0-9]*[a-zA-Z0-9_]+(?=\.[^.]+$|$)/,
] as const;

// export const yearPattern = /(?:^|\D)(?<year>19[3-9]\d|20[0-3]\d)(?:\D|$)/;
export const resolutionPattern = /^(?:480|576|720|1080|2160|4320)p?$/i;
export const standalonePattern =
  /^(?:br|blu|bluray|ray|web|webdl|dl|dvd|4k|8k|u?hd(?:tv)?|amzn|nf|hdr(?:\d+\+?)?|dv|sdr|cam|remux)$/i;
export const seriesPattern =
  // both regexps are the same
  // /(?<=^|[^a-zA-Z0-9])s\d\de\d\d(?=[^a-zA-Z0-9]|$)/i;
  /(?<![a-zA-Z0-9])s\d\de\d\d(?![a-zA-Z0-9])/i;
export const ripPattern = /^(?:br|bluray|bd|hd(?:tv)?|tv|cam|dvd|web|re)?rip$/i;
export const audioPattern = /^(?:[ae]?ac\d+?|dts|dd(?:p\d+?)?|truehd|atmos|mp\d+|flac)$/i;
export const videoPattern = /^(?:[xh]?26[45]|divx|xvid|hevc|avc)$/i;
export const languagePattern =
  /^(?:polish|lektor(?:pl)?|pl|(?:pl)?dub(?:pl|bed)?|sub(?:s|pl)?|napisy|multi|eng?|de|ger|fra?|ita?|esp?)$/i;
export const scenePattern = /^(?:proper|repack|internal|readnfo|complete)$/i;
export const editionPattern =
  /^(?:extended|remastered|director'?s?|cut|criterion|imax|limited|unrated)$/i;

export const cutPatterns: RegExp[] = [
  seriesPattern,
  resolutionPattern,
  standalonePattern,
  ripPattern,
  audioPattern,
  videoPattern,
] as const;

export const ignoreInFileName: RegExp[] = [
  resolutionPattern,
  standalonePattern,
  ripPattern,
  audioPattern,
  videoPattern,
  languagePattern,
  scenePattern,
  editionPattern,
] as const;

export const splitRegex = /[^a-zA-Z0-9]+/;

/// HELPER FUNCTIONS

export const removeMetadataFromFileName = (fileName: string): string => {
  const clean = removePatterns.reduce((name, re) => name.replace(re, ''), fileName);
  const lastDot = clean.lastIndexOf('.');
  const extension = clean.slice(lastDot + 1).toLowerCase();
  const hasExtension = lastDot > 0 && videoExtensions.has(extension);
  const base = hasExtension ? clean.slice(0, lastDot) : clean;

  // console.log({ fileName, base, extension, hasExtension, lastDot });

  // matchAll() requires /g flag
  // TypeError: String.prototype.matchAll called with a non-global RegExp argument
  const wordPattern = /[a-zA-Z0-9]+/g;

  for (const word of base.matchAll(wordPattern)) {
    if (cutPatterns.some(re => re.test(word[0]))) {
      const sliced = base.slice(0, word.index).replace(/[^a-zA-Z0-9]+$/, '');
      return hasExtension ? `${sliced}.${extension}` : sliced;
    }
  }

  return hasExtension ? `${base}.${extension}` : base;
};

export const extractRelevantWords = (fileName: string): string[] =>
  removeMetadataFromFileName(fileName.toLowerCase())
    .split(splitRegex)
    .filter(Boolean)
    .filter(
      word =>
        !ignoreInFileName.some(rx => rx.test(word)) &&
        !videoExtensions.has(word) &&
        !subtitlesExtensions.has(word),
    );

export const rename = (fileName: string, newFileName: string, message: string): void => {
  try {
    if (fileName !== newFileName) {
      console.log(' ');
      console.log(`┌─ ${message} START`);
      console.log('|', fileName);
      console.log('|', newFileName);

      if (fileName.toLowerCase() === newFileName.toLowerCase()) {
        Deno.renameSync(`${path}${fileName}`, `${path}${fileName}.tmp`);
        Deno.renameSync(`${path}${fileName}.tmp`, `${path}${newFileName}`);
      } else Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);

      console.log(`└─ ${message} END`);
    }
  } catch (err) {
    console.error(`Error renaming ${fileName}:`, err);
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await Deno.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

export const updateUrl = async (fileName: string) => {
  if (!(await fileExists(`${path}${fileName}`))) {
    console.log('⚠ File does not exists:', { fileName, path: `${path}${fileName}` });
    return;
  }

  const fileEpisode = fileName.match(/s\d+e(\d+)/i)?.[1];
  if (!fileEpisode) {
    console.log(' ');
    console.log('[ FILE EPISODE ERROR ]', { file: fileName, episode: fileEpisode });
    return;
  } else if (fileEpisode === '00') {
    console.log(' ');
    console.log('[ SKIPPING EPISODE 00 ]', { file: fileName, episode: fileEpisode });
    return;
  }

  const file = Deno.readTextFileSync(`${path}${fileName}`);

  const url = file.match(/^URL=(.+)$/m)?.[1]?.trim();
  if (!url) {
    console.log(' ');
    console.log('[ URL ERROR ]', { fileName, path: `${path}${fileName}`, url });
    return;
  }

  const urlEpisode = url.match(/s\d+e(\d+)/i)?.[1];
  if (!urlEpisode) {
    console.log(' ');
    console.log('[ URL EPISODE ERROR ]', { fileName, path: `${path}${fileName}`, urlEpisode });
    return;
  }

  if (url.includes('thepiratebay') || url.includes('apibay')) {
    if (+fileEpisode !== +urlEpisode - 1) {
      const newEpisode = (+fileEpisode + 1).toString().padStart(2, '0');
      const newUrl = url.replace(/(s\d+e)\d+/i, '$1' + newEpisode);
      const newFile = file.replace(/^URL=.+$/m, 'URL=' + newUrl);
      console.log(' ');
      console.log('[ UPDATING EPISODE ]', {
        file: fileName,
        oldUrl: url,
        newUrl,
      });
      Deno.writeTextFileSync(`${path}${fileName}`, newFile);
    }
  } else console.log('[ UNKNOWN URL ]', { fileName, path: `${path}${fileName}`, url });
};

export const renameUrl = async (
  fileName: string,
  newFileName: string,
  files: string[],
  message: string,
): Promise<void> => {
  try {
    if (fileName === newFileName) return;
    if (await fileExists(`${path}${newFileName}`)) {
      console.log('⚠ Cannot rename - file already exists:', { fileName, newFileName });
      return;
    }
    console.log(' ');
    console.log(`┌─── ${message} START`);
    console.log('| ┌─', fileName);
    for (const file of files) console.log('| | ', file);
    console.log('| └→', newFileName);
    Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
    console.log(`└─── ${message} END`);
  } catch (err) {
    console.error(`Error renaming ${fileName}:`, err);
  }
};

export const getMatchPercentage = (aWords: string[], bWords: string[]): number => {
  if (aWords.length === 0 || bWords.length === 0) return 0;

  const aMatches = aWords.filter(word => bWords.includes(word)).length;
  const bMatches = bWords.filter(word => aWords.includes(word)).length;

  const aPercent = (aMatches / aWords.length) * 100;
  const bPercent = (bMatches / bWords.length) * 100;

  return Math.round(Math.min(aPercent, bPercent));
};

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
  const aMatch = aFileName.match(destructureSeriesPattern);
  const bMatch = bFileName.match(destructureSeriesPattern);

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

export const destructureSeriesPattern =
  /(?<prefix>.*)s(?<season>\d\d)e(?<episode>\d\d)(?<postfix>.*)/i;

type DestructuredSeries = {
  prefix: string;
  season: string;
  episode: string;
  postfix: string;
} | null;

export const destructureSeries = (fileName: string): DestructuredSeries => {
  const match = fileName.match(destructureSeriesPattern);
  if (!match?.groups) return null;
  return {
    prefix: match.groups.prefix,
    season: match.groups.season,
    episode: match.groups.episode,
    postfix: match.groups.postfix,
  };
};

/// RENAME TO LOWERCASE

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) rename(dirEntry.name, dirEntry.name.toLowerCase(), 'RENAME TO LOWERCASE');
}

/// RENAME SPACES TO DOTS

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile)
    rename(dirEntry.name, dirEntry.name.split(/[\s\.]+/).join('.'), 'RENAME SPACES TO DOTS');
}

/// DESTRUCTURE DIRECTORY FILES

export const videoFileNames: string[] = [];
export const subtitlesFileNames: string[] = [];
export const seriesUrlFileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) {
    const fileExtension = dirEntry.name.slice(dirEntry.name.lastIndexOf('.') + 1).toLowerCase();
    if (videoExtensions.has(fileExtension)) videoFileNames.push(dirEntry.name);
    else if (subtitlesExtensions.has(fileExtension)) subtitlesFileNames.push(dirEntry.name);
    else if (urlExtensions.has(fileExtension)) {
      const match = dirEntry.name.match(destructureSeriesPattern);
      if (match?.groups && match.groups.season && match.groups.episode)
        seriesUrlFileNames.push(dirEntry.name);
    }
  }
}

videoFileNames.sort();
subtitlesFileNames.sort();
seriesUrlFileNames.sort();

/// RENAME SERIES URLS

for (const urlFileName of seriesUrlFileNames) {
  const destructuredUrlFileName = destructureSeries(urlFileName);
  if (!destructuredUrlFileName) continue;
  const urlWords = extractRelevantWords(destructuredUrlFileName.prefix);
  const urlExtension = urlFileName.slice(urlFileName.lastIndexOf('.'));

  const videoFileNamesInBetween: string[] = [];
  let lastEpisode = destructuredUrlFileName.episode;
  let newUrlFileName = urlFileName;

  for (const videoFileName of videoFileNames) {
    const destructuredVideoFileName = destructureSeries(videoFileName);
    if (!destructuredVideoFileName) continue;
    const videoWords = extractRelevantWords(destructuredVideoFileName.prefix);
    if (
      getMatchPercentage(urlWords, videoWords) === 100 &&
      destructuredUrlFileName.season === destructuredVideoFileName.season &&
      +destructuredVideoFileName.episode === +lastEpisode + 1
    ) {
      videoFileNamesInBetween.push(videoFileName);
      lastEpisode = destructuredVideoFileName.episode;
      newUrlFileName = videoFileName.slice(0, videoFileName.lastIndexOf('.')) + urlExtension;
    }
  }

  if (lastEpisode > destructuredUrlFileName.episode) {
    // console.log('Will rename to:', { urlFileName, newUrlFileName });
    await renameUrl(urlFileName, newUrlFileName, videoFileNamesInBetween, 'RENAMING URL');
  }

  updateUrl(newUrlFileName);
}

/// RENAME SUBTITLES

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

    console.log(' ');
    console.log('Subtitles mismatch');
    console.log('├─ Matched video:', match.result);
    console.log('├─ Subtitles:    ', subtitlesFileName);
    console.log('├─ Subtitle words:', subtitlesWords);
    console.log('├─ Video words:   ', videoWords);
    console.log('└─ Matched percent:', match.percent + '%');

    rename(subtitlesFileName, newSubtitlesFileName, 'RENAMING SUBTITLE');
  }
}
