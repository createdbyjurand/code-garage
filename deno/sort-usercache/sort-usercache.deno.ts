async function sortJsonArray(input: string, output: string) {
  try {
    const json = await Deno.readTextFile(input);
    const parsedJson = JSON.parse(json);
    if (!Array.isArray(parsedJson)) throw new Error('Input JSON is not an array.');
    const sortedParsedJson = parsedJson
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((arr_item, arr_index, arr) => {
        const isDuplicate =
          arr.findIndex(
            item_found => item_found.name === arr_item.name && item_found.uuid === arr_item.uuid
          ) !== arr_index;
        if (isDuplicate) console.log('Duplicate found:', arr_item);
        return !isDuplicate;
      });
    const sortedJson = JSON.stringify(sortedParsedJson, null, 4);
    await Deno.writeTextFile(output, sortedJson);
    console.log(`Sorted JSON saved successfully to ${output}`);
  } catch (err) {
    console.error('Error processing JSON file:', err);
  }
}
const inputFile = 'usercache.json';
const outputFile = 'sorted-usercache.json';
await sortJsonArray(inputFile, outputFile);
