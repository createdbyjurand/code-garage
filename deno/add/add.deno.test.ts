import { join } from 'node:path';

const scriptUrl = new URL('./add.deno.ts', import.meta.url);

Deno.test('cleans URL argument edges separately from the file name', async () => {
  const directory = await Deno.makeTempDir();
  try {
    const result = await new Deno.Command(Deno.execPath(), {
      args: [
        'run',
        '--allow-write',
        scriptUrl.href,
        '...Movie...',
        '(S01-E02)',
        '***',
        '?!',
        'Żółć',
        '*wild*',
      ],
      cwd: directory,
      stdout: 'piped',
      stderr: 'piped',
    }).output();

    if (!result.success) {
      throw new Error(new TextDecoder().decode(result.stderr));
    }

    const content = await Deno.readTextFile(join(directory, 'movie.s01 e02.wild.url'));
    const match = content.match(/^\[InternetShortcut\]\r\nURL=(.+)\r\n$/);
    if (!match) {
      throw new Error(`Unexpected shortcut content: ${content}`);
    }

    const url = new URL(match[1]);
    const query = url.searchParams.get('q');
    if (query !== 'movie s01-e02 *** żółć *wild* 1080*') {
      throw new Error(`Unexpected search query: ${query}`);
    }
    if (url.searchParams.get('cat') !== '0') {
      throw new Error(`Unexpected category: ${url.searchParams.get('cat')}`);
    }
  } finally {
    await Deno.remove(directory, { recursive: true });
  }
});
