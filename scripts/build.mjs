import { build } from "esbuild";
import { minify } from "html-minifier";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const SRC = resolve(__dirname, "../src");
const DIST = resolve(__dirname, "../dist");
const html = await readFile(join(SRC, "index.html"), "utf8");

await rm(DIST, { force: true, recursive: true });

await build({
  bundle: true,
  entryPoints: [join(SRC, "js/main.mjs")],
  format: "esm",
  minify: true,
  outExtension: {
    ".js": ".mjs",
  },
  outdir: join(DIST, "js"),
  target: "esnext",
});

await writeFile(
  join(DIST, "index.html"),
  minify(html, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    minifyCSS: true,
    removeComments: true,
  }),
  "utf8",
);
