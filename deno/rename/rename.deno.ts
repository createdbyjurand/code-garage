const path = './';

const rename = (fileName: string, newFileName: string, message: string): void => {
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

const fileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) dirEntry.isFile && fileNames.push(dirEntry.name);

fileNames.sort();

const EPISODE_REGEXP = /[^s\d]\d\d\./;
const SEASON_EPISODE_REGEXP = /\.s\d\de\d\d\./;

const slicePrefix = (fileName: string, regexp: RegExp, changeStart = 0, changeEnd = 0): string =>
  fileName.slice(0 + changeStart, fileName.search(regexp) + changeEnd);

const sliceString = (fileName: string, regexp: RegExp, before = 0, after = 0): string =>
  fileName.slice(fileName.search(regexp) + before, fileName.search(regexp) + after);

const sliceNumber = (fileName: string, regexp: RegExp, before = 0, after = 0): number =>
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

/*

const ignoreInFileName = [
  /^1080p$/i,
  /^720p$/i,
  /^480p$/i,
  /^2160p$/i,
  /^4k$/i,
  /^divx$/i,
  /^xvid$/i,
  /^x264$/i,
  /^x265$/i,
  /^hevc$/i,
  /^h264$/i,
  /^h265$/i,
  /^aac$/i,
  /^ac3$/i,
  /^dts$/i,
  /^bluray$/i,
  /^brrip$/i,
  /^webrip$/i,
  /^web$/i,
  /^dl$/i,
  /^hdrip$/i,
  /^dvdrip$/i,
  /^proper$/i,
  /^repack$/i,
  /^internal$/i,
  /^5\.1$/i,
  /^7\.1$/i,
  /^atmos$/i,
];

const splitRegex = /[.,_()\/\\\-\s\[\]]+/;

const extractRelevantWords = (fileName: string): string[] =>
  fileName
    .toLowerCase()
    .split(splitRegex)
    .filter(Boolean)
    .filter(word => !ignoreInFileName.some(rx => rx.test(word)));

const getMatchPercentage = (videoWords: string[], subtitleWords: string[]): number => {
  if (videoWords.length === 0) return 0;
  const matches = videoWords.filter(word => subtitleWords.includes(word)).length;
  return Math.round((matches / videoWords.length) * 100);
};

const findBestMatch = (
  referenceFileName: string,
  possibleMatches: string[]
): { match: string; matchPercent: number } | null => {
  const referenceWords = extractRelevantWords(referenceFileName);
  let bestMatch: { match: string; matchPercent: number } | null = null;

  for (const match of possibleMatches) {
    const matchWords = extractRelevantWords(match);
    const matchPercent = getMatchPercentage(referenceWords, matchWords);

    if (!bestMatch || matchPercent > bestMatch.matchPercent) bestMatch = { match, matchPercent };
  }

  return bestMatch;
};

// const findBestSubtitleMatch = (
//   videoFileName: string,
//   subtitleFileNames: string[]
// ): { subtitleFileName: string; matchPercent: number } | null => {
//   const videoWords = extractRelevantWords(videoFileName);
//   let bestMatch: { subtitleFileName: string; matchPercent: number } | null = null;

//   for (const subtitleFileName of subtitleFileNames) {
//     const subtitleWords = extractRelevantWords(subtitleFileName);
//     const matchPercent = getMatchPercentage(videoWords, subtitleWords);

//     if (!bestMatch || matchPercent > bestMatch.matchPercent)
//       bestMatch = { subtitleFileName, matchPercent };
//   }

//   return bestMatch;
// };

// const findBestVideoFileMatch = (
//   subtitleFileName: string,
//   videoFileNames: string[]
// ): { videoFileName: string; matchPercent: number } | null => {
//   const subtitleWords = extractRelevantWords(subtitleFileName);
//   let bestMatch: { videoFileName: string; matchPercent: number } | null = null;

//   for (const videoFileName of videoFileNames) {
//     const videoWords = extractRelevantWords(videoFileName);
//     const matchPercent = getMatchPercentage(videoWords, subtitleWords);

//     if (!bestMatch || matchPercent > bestMatch.matchPercent)
//       bestMatch = { videoFileName, matchPercent };
//   }

//   return bestMatch;
// };

// Collect video and subtitle files

const videoExtensions = ['.mkv', '.mp4', '.avi'];
const subtitleExtensions = ['.srt', '.txt'];

const videoFiles: string[] = [];
const subtitleFiles: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) {
    const fileName = dirEntry.name;
    const ex = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

    if (videoExtensions.includes(ex)) videoFiles.push(fileName);
    else if (subtitleExtensions.includes(ex)) subtitleFiles.push(fileName);
  }
}

// Match subtitles to video files

console.log('\n=== Matching Subtitles to Video Files ===\n');

for (const videoFile of videoFiles) {
  const match = findBestMatch(videoFile, subtitleFiles);

  if (match) {
    const videoWords = extractRelevantWords(videoFile);
    const subtitleWords = extractRelevantWords(match.match);

    console.log(`\n┌─── Video: ${videoFile}`);
    console.log(`├─── Video words: [${videoWords.join(', ')}]`);
    console.log(`├─── Best subtitle match (${match.matchPercent}%): ${match.match}`);
    console.log(`└─── Subtitle words: [${subtitleWords.join(', ')}]`);

    // If match is good enough, you can rename the subtitle to match the video
    if (match.matchPercent >= 70) {
      const videoBaseName = videoFile.slice(0, videoFile.lastIndexOf('.'));
      const subtitleExt = match.match.slice(match.match.lastIndexOf('.'));
      const newSubtitleName = `${videoBaseName}${subtitleExt}`;

      if (match.match !== newSubtitleName) {
        // Uncomment to actually rename:
        // rename(match.subtitle, newSubtitleName, 'Matched subtitle');
        console.log(`    → Would rename to: ${newSubtitleName}`);
      }
    }
  } else {
    console.log(`\n✗ No subtitle found for: ${videoFile}`);
  }
}

*/

fileNames.length = 0;
for (const dirEntry of Deno.readDirSync(path)) dirEntry.isFile && fileNames.push(dirEntry.name);
fileNames
  .filter(fileName => fileName.endsWith('.srt'))
  .forEach(srtFileName => {
    /**
     * if there are two or more files found than:
     * - there is already movie file and subtitle file with the same name
     * - there are multiple subtitle files
     */
    const baseName = (fileName: string) =>
      fileName.slice(0, fileName.lastIndexOf('.')).toLowerCase();
    if (
      fileNames.filter(
        fileName =>
          !fileName.toLowerCase().endsWith('.txt') &&
          !fileName.toLowerCase().endsWith('.url') &&
          baseName(fileName) === baseName(srtFileName)
      ).length === 1
    ) {
      // for series
      if (srtFileName.match(/\.s\d\de\d\d\./)) {
        const prefix = slicePrefix(srtFileName, SEASON_EPISODE_REGEXP);
        const season = sliceString(srtFileName, SEASON_EPISODE_REGEXP, 2, 4);
        const episode = sliceString(srtFileName, SEASON_EPISODE_REGEXP, 5, 7);
        console.log(' ');
        console.log('---');
        console.log(' ');
        console.log(`Found orphaned .srt series file: ${srtFileName}`);
        // console.log(`prefix: ${prefix}`);
        // console.log(`season: ${season}`);
        // console.log(`episode: ${episode}`);
        const found = fileNames.filter(
          fileName =>
            !fileName.toLowerCase().endsWith('.url') &&
            !fileName.toLowerCase().endsWith('.txt') &&
            !fileName.toLowerCase().endsWith('.srt') &&
            prefix
              .replace(/[^a-zA-Z0-9.]/g, '')
              .split('.')
              .concat(`s${season}e${episode}`)
              .every(word => fileName.toLowerCase().includes(word.toLowerCase()))
        );
        if (found.length === 0) {
          console.log('That matches no file');
        } else if (found.length === 1) {
          const newSrtFileName = found[0].replace(/\.[^\.]+$/, '.srt');
          console.log('That matches one file:', found);
          console.log(' ');
          console.log('┌─── RENAMING SUBTITLE SERIES FILE START');
          console.log('| ┌─', srtFileName);
          console.log('| | ', found[0]);
          try {
            Deno.statSync(`${path}${newSrtFileName}`);
            console.error(`| └─ ${newSrtFileName} already exists!`);
          } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
              console.log('| └>', newSrtFileName);
              Deno.renameSync(`${path}${srtFileName}`, `${path}${newSrtFileName}`);
            } else {
              throw err;
            }
          }
          console.log(`└─── RENAMING SUBTITLE SERIES FILE END`);
        } else {
          console.log('That matches multiple files:', found);
        }
        // for movies
      } else {
        const prefix = srtFileName.slice(0, srtFileName.lastIndexOf('.'));
        console.log(' ');
        console.log('---');
        console.log(' ');
        console.log(`Found orphaned .srt movie file: ${srtFileName}`);
        // percent match
        const percentMatch = 50;
        const wordMatchPercentage = (aString: string, bString: string): number =>
          Math.round(
            (aString
              .split('.')
              .filter(word => word.length > 0)
              .filter(word =>
                bString
                  .split('.')
                  .filter(word => word.length > 0)
                  .includes(word)
              ).length /
              aString.split('.').filter(word => word.length > 0).length) *
              100
          );
        const found = fileNames.filter(
          fileName =>
            !fileName.toLowerCase().endsWith('.url') &&
            !fileName.toLowerCase().endsWith('.txt') &&
            !fileName.toLowerCase().endsWith('.srt') &&
            wordMatchPercentage(
              prefix.replace(/[^a-zA-Z0-9.]/g, ''),
              fileName.replace(/[^a-zA-Z0-9.]/g, '')
            ) >= percentMatch
        );
        if (found.length === 0) {
          console.log(`That matches no file in ${percentMatch}%`);
        } else if (found.length === 1) {
          const percentMatched = wordMatchPercentage(
            prefix.replace(/[^a-zA-Z0-9.]/g, ''),
            found[0].replace(/[^a-zA-Z0-9.]/g, '')
          );
          const newSrtFileName = found[0].replace(/\.[^\.]+$/, '.srt');
          console.log(`That matches one file in ${percentMatched}%:`, found);
          console.log(' ');
          console.log('┌─── RENAMING SUBTITLE MOVIE FILE START');
          console.log('| ┌─', srtFileName);
          console.log('| | ', found[0]);
          try {
            Deno.statSync(`${path}${newSrtFileName}`);
            console.error(`| └─ ${newSrtFileName} already exists!`);
          } catch (err) {
            if (err instanceof Deno.errors.NotFound) {
              console.log('| └>', newSrtFileName);
              Deno.renameSync(`${path}${srtFileName}`, `${path}${newSrtFileName}`);
            } else {
              throw err;
            }
          }
          console.log(`└─── RENAMING SUBTITLE MOVIE FILE END`);
        } else {
          console.log('That matches multiple files:', found);
        }
      }
    }
  });
