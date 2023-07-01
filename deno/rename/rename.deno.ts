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
  if (dirEntry.isFile) rename(dirEntry.name, dirEntry.name.split(' ').join('.'), 'RENAME SPACES TO DOTS');
}

const fileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) fileNames.push(dirEntry.name);
}

fileNames.sort();

const EPISODE_REGEXP = /[^s\d]\d\d\./;
const SEASON_EPISODE_REGEXP = /\.s\d\de\d\d\./;

const slicePrefix = (fileName: string, regexp: RegExp, changeStart = 0, changeEnd = 0): string =>
  fileName.slice(0 + changeStart, fileName.search(regexp) + changeEnd);

const sliceNumber = (fileName: string, regexp: RegExp, before = 0, after = 0): number =>
  +fileName.slice(fileName.search(regexp) + before, fileName.search(regexp) + after);

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
