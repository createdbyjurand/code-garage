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

const getTitle = (fileName: string) => fileName.slice(0, fileName.search(/\.s\d\de\d\d\./));
const getSeasonNumber = (fileName: string) =>
  +fileName.slice(fileName.search(/\.s\d\de\d\d\./) + 2, fileName.search(/\.s\d\de\d\d\./) + 4);
const getEpisodeNumber = (fileName: string) =>
  +fileName.slice(fileName.search(/\.s\d\de\d\d\./) + 5, fileName.search(/\.s\d\de\d\d\./) + 7);

const fileNames: string[] = [];

for (const dirEntry of Deno.readDirSync(path)) {
  if (dirEntry.isFile) fileNames.push(dirEntry.name);
}

fileNames.map((fileName, index, array) => {
  if (fileName.match(/^.*\.s\d\de\d\d\..*\.url$/)) {
    const title = getTitle(fileName);
    const seasonNumber = getSeasonNumber(fileName);
    const episodeNumber = getEpisodeNumber(fileName);
    let i = index;
    while (
      i + 1 < array.length &&
      title === getTitle(array[i + 1]) &&
      seasonNumber === getSeasonNumber(array[i + 1]) &&
      episodeNumber + 1 + i - index === getEpisodeNumber(array[i + 1])
    )
      i++;
    if (i > index) {
      console.log(' ');
      console.log('┌─── RENAME URL START');
      console.log('| ┌─', fileName);
      const newFileName = array[i].slice(0, array[i].lastIndexOf('.')) + '.url';
      let n = index + 1;
      while (n <= i) console.log('| | ', array[n++]);
      console.log('| └>', newFileName);
      Deno.renameSync(`${path}${fileName}`, `${path}${newFileName}`);
      console.log(`└─── RENAME URL END`);
    }
  }
});
