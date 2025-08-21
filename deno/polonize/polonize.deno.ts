// Import Deno's filesystem and encoding modules
import { readTextFile, writeTextFile } from "https://deno.land/std/fs/mod.ts";
import { encode } from "https://deno.land/std/encoding/utf8.ts";

// Define the file path
const filePath = "./yourfile.txt";

// Read the file
const content = await readTextFile(filePath);

// Define the regular expression for replacement
const find = /\(¹\)|\(¿\)|\(œ\)|\(Ÿ\)|\(ê\)|\(æ\)|\(ó\)|\(³\)|\(ñ\)|\(¥\)|\(¯\)|\(Œ\)|\(\)|\(Ê\)|\(Æ\)|\(Ó\)|\(£\)|\(Ñ\)/g;
const replace = "(?1ą)(?2ż)(?3ś)(?4ź)(?5ę)(?6ć)(?7ó)(?8ł)(?9ń)(?10Ą)(?11Ż)(?12Ś)(?13Ź)(?14Ę)(?15Ć)(?16Ó)(?17Ł)(?18Ń)";

// Replace the characters
const modifiedContent = content.replace(find, replace);

// Write the modified content back to the file (or specify a new file path)
await writeTextFile(filePath, encode(modifiedContent));

console.log("File processed and saved.");
