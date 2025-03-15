const path = './';

const rename = (fileName: string, newFileName: string, message: string) => {
  if (fileName !== newFileName) {
    console.log(' ');
    console.log(`┌─ ${message} START`);
    console.log('|', fileName);
    console.log('|', newFileName);
    Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
    console.log(`└─ ${message} END`);
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
