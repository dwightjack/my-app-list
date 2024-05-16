import { join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { rm, readFile, writeFile } from 'node:fs/promises';
import { minify } from 'html-minifier';
import { build } from 'esbuild';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SRC = resolve(__dirname, '../src');
const DIST = resolve(__dirname, '../dist');
const html = await readFile(join(SRC, 'index.html'), 'utf-8');

await rm(DIST, { recursive: true, force: true });

await build({
  entryPoints: [join(SRC, 'js/main.mjs')],
  bundle: true,
  format: 'esm',
  target: 'esnext',
  outdir: join(DIST, 'js'),
  outExtension: {
    '.js': '.mjs',
  },
  minify: true,
});

await writeFile(
  join(DIST, 'index.html'),
  minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    removeComments: true,
  }),
  'utf-8',
);
