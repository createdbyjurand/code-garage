const args: string[] = Deno.args;

const fileNameReplacePattern = /[^A-Za-z0-9ążśźęćółńĄŻŚŹĘĆÓŁŃ]+/g;
const urlQRenamePattern = /[^A-Za-z0-9ążśźęćółńĄŻŚŹĘĆÓŁŃ*]+/g;

if (args.length < 1) {
  console.error('⚠ Please provide a name for the URL file.');
  Deno.exit(1);
}

const fileName: string =
  args
    .map(arg => arg.replace(fileNameReplacePattern, ' ').trim())
    .filter(arg => arg.length > 1)
    .join('.')
    .toLowerCase() + '.url';

const url = new URL('https://thepiratebay.org/search.php');
url.searchParams.set(
  'q',
  args
    .map(arg => arg.replace(urlQRenamePattern, ' ').trim())
    .filter(arg => arg.length > 0)
    .join(' ')
    .toLowerCase() + ' 1080*',
);
url.searchParams.set('cat', '0');

const fileContent = `[InternetShortcut]\r\nURL=${url.href}\r\n`;

try {
  Deno.writeTextFileSync(fileName, fileContent);
  console.log('Successfully created file:', { fileName, url, fileContent });
} catch (err) {
  console.error('⚠ Failed to create the file:', err);
}
