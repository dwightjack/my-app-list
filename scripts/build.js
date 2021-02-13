const { resolve, join } = require('path');
const del = require('del');
const { readFile, writeFile, mkdir } = require('fs').promises;
const { minify } = require('html-minifier');
const { minify: terser } = require('terser');

(async () => {
  const SRC = resolve(__dirname, '../src');
  const DIST = resolve(__dirname, '../dist');
  await del([`${DIST}/**`]);

  const html = await readFile(join(SRC, 'index.html'), 'utf-8');
  const js = await readFile(join(SRC, 'js', 'main.js'), 'utf-8');

  await mkdir(join(DIST, 'js'), { recursive: true });

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
  await writeFile(
    join(DIST, 'js', 'main.js'),
    (await terser(js)).code,
    'utf-8',
  );
})();
