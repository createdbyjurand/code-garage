const entries: { name: string; path: string; words: string[] }[] = [];
const dir = '.';
const percentMatch: number = 51;
const splitRegex = /(?<![A-Z]{2})(?=[A-Z][a-z])|(?<=[a-z])(?=\d)|(?<=\d)(?=[a-zA-Z])|[^a-zA-Z0-9]+/;
const exceptions = [
  './links/',
  // './ok complicated/Chloe18',
  // './ok easy loli/DMD.CH',
  './ok easy/cma-ch',
  './ok easy/GrandmasHouse',
  './ok easy/MISFITS-Part',
  './test/DFD_ch',
  './test/DFD_Ch',
];
const ignore = [
  /^v$/i,
  // /^part$/i,
  // /^\d+a$/i,
  // /^\d+b$/i,
  /^pc$/i,
  // /^win$/i,
  /^zip$/i,
  // /^beta$/i,
  // /^public$/i,
  // /^chapter$/i,
];
const wordCount: Record<string, number> = {};

const extract = (s: string): string[] =>
  s
    .split(splitRegex)
    .filter(item => isNaN(Number(item)))
    .map(word => word.toLowerCase())
    .filter(word => word.length > 0 && !ignore.some(rx => rx.test(word)))
    .map(word => ((wordCount[word] = (wordCount[word] || 0) + 1), word));

// const getMatchPercentage = (a: string, b: string): number => {
//   const ea = extract(a);
//   const eb = extract(b);
//   return Math.round((ea.filter(word => eb.includes(word)).length / ea.length) * 100);
// };

// const getMatchPercentage = (a: string, b: string): number =>
//   Math.round(
//     (extract(a).filter(word => extract(b).includes(word)).length / extract(a).length) * 100
//   );

const getMatchPercentage = (a: string[], b: string[]): number =>
  Math.round((a.filter(word => b.includes(word)).length / a.length) * 100);

// const getMatchPercentage = (a: string, b: string): number =>
//   Math.round(
//     (a
//       .split(splitRegex)
//       .filter(item => isNaN(Number(item)))
//       .map(word => word.toLowerCase())
//       .filter(word => word.length > 0 && !ignore.includes(word))
//       .filter(word =>
//         b
//           .split(splitRegex)
//           .filter(item => isNaN(Number(item)))
//           .map(word => word.toLowerCase())
//           .filter(word => word.length > 0 && !ignore.includes(word))
//           .includes(word)
//       ).length /
//       a
//         .split(splitRegex)
//         .filter(item => isNaN(Number(item)))
//         .map(word => word.toLowerCase())
//         .filter(word => word.length > 0 && !ignore.includes(word)).length) *
//       100
//   );

const hasException = (path: string): boolean =>
  exceptions.some(exception => path.includes(exception));

for (const dirEntry of Deno.readDirSync(dir)) {
  if (dirEntry.isDirectory) {
    const subDir = `${dir}/${dirEntry.name}`;
    for (const subDirEntry of Deno.readDirSync(subDir)) {
      if (subDirEntry.isFile) {
        const words = extract(subDirEntry.name);
        // console.log(`Extracted words from file "${subDirEntry.name}":`, words);
        words.forEach(word => (wordCount[word] = (wordCount[word] || 0) + 1));
        // console.log(subDirEntry.name, subDirEntry.name.split(splitRegex));
        entries.push({
          name: subDirEntry.name.toLowerCase().replace(/\.[^\.]+$/, ''),
          path: `${subDir}/${subDirEntry.name}`,
          words,
        });
      } else if (subDirEntry.isDirectory) {
        const words = extract(subDirEntry.name);
        // console.log(`Extracted words from directory "${subDirEntry.name}":`, words);
        words.forEach(word => (wordCount[word] = (wordCount[word] || 0) + 1));
        // console.log(subDirEntry.name, subDirEntry.name.split(splitRegex));
        entries.push({
          name: subDirEntry.name.toLowerCase(),
          path: `${subDir}/${subDirEntry.name}`,
          words,
        });
      }
    }
  }
}

for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const entryA = entries[i];
    const entryB = entries[j];
    const isSamePath =
      entryA.path.replace(/\/[^\/]+$/, '') === entryB.path.replace(/\/[^\/]+$/, '');
    if (hasException(entryA.path) && isSamePath) continue;
    const percentAB = getMatchPercentage(entryA.words, entryB.words);
    const percentBA = getMatchPercentage(entryB.words, entryA.words);
    // if (getMatchPercentage(entryA.words, entryB.words) >= percentMatch) {
    if (percentAB >= percentMatch && percentBA >= percentMatch) {
      console.log('┌─── Possible duplicate found');
      console.log(`├ ${entryA.path}`);
      console.log(`├ [${entryA.words.join(', ')}]`);
      console.log(`├ ${entryB.path}`);
      console.log(`└ [${entryB.words.join(', ')}]`);
      console.log('');
    }
  }
}

// console.log('Word occurrences:');
// console.log(Object.fromEntries(Object.entries(wordCount).sort((a, b) => b[1] - a[1])));
