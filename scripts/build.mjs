import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { minify } from 'html-minifier';
import { build } from 'esbuild';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const SRC = resolve(__dirname, '../src');
const DIST = resolve(__dirname, '../dist');
const html = await fs.readFile(join(SRC, 'index.html'), 'utf-8');

await fs.rm(DIST, { recursive: true, force: true });

await build({
  entryPoints: [join(SRC, 'js/main.js')],
  bundle: true,
  format: 'esm',
  target: 'esnext',
  outdir: join(DIST, 'js'),
  minify: true,
});

await fs.writeFile(
  join(DIST, 'index.html'),
  minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    removeComments: true,
  }),
  'utf-8',
);
