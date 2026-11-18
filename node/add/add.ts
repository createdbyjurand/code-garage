import { writeFileSync } from 'node:fs';

const args: string[] = process.argv.slice(2);

if (args.length < 1) {
  console.error('⚠ Please provide a name for the URL file.');
  process.exit(1);
}

const fileName: string = args.join('.').toLowerCase() + '.url';

const url = new URL('https://thepiratebay.org/search.php');
url.searchParams.set('q', args.join(' ').toLowerCase() + ' 1080*');
url.searchParams.set('cat', '0');

const fileContent = `[InternetShortcut]\r\nURL=${url.href}\r\n`;

try {
  writeFileSync(fileName, fileContent, 'utf8');
  console.log('Successfully created file:', { fileName, url, fileContent });
} catch (err) {
  console.error('⚠ Failed to create the file:', err);
}
