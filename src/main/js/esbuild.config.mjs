/**
 * esbuild config: bundle render.mjs + linkedom + bpmn-js into a single CJS file
 * for embedding in the JAR as a classpath resource.
 *
 * Output: src/main/resources/bpmn-render.js (CommonJS, self-contained)
 */
import * as esbuild from "esbuild";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(__dirname, "../resources/bpmn-render.js");

await esbuild.build({
  entryPoints: [resolve(__dirname, "src/render.mjs")],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: outFile,
  external: [],           // bundle everything — no node_modules at runtime
  // bpmn-js dist bundle is a UMD file — mark as external and handle separately
  plugins: [
    {
      name: "bpmn-js-viewer-inline",
      setup(build) {
        // Resolve "bpmn-js/dist/bpmn-viewer.production.min.js" to its file path
        // so esbuild bundles the raw JS (already a self-contained UMD bundle)
        build.onResolve({ filter: /bpmn-viewer\.production\.min/ }, (args) => {
          return {
            path: resolve(
              __dirname,
              "node_modules/bpmn-js/dist/bpmn-viewer.production.min.js"
            ),
          };
        });
      },
    },
  ],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  minify: false,   // keep readable for easier debugging; bundle is ~700KB anyway
  sourcemap: false,
  logLevel: "info",
});

const stat = readFileSync(outFile);
console.log(`\nBundled to ${outFile}`);
console.log(`Size: ${(stat.length / 1024).toFixed(1)} KB`);
