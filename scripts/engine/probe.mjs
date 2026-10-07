// Renders probe stills of a composition after a single bundle: node scripts/engine/probe.mjs <CompId> <outDir> <frame...>
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const [id, outDir, ...frames] = process.argv.slice(2);
const root = new URL("../../", import.meta.url).pathname;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const f of frames.length ? frames.map(Number) : []) {
  const output = path.join(outDir, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ serveUrl, composition, frame: f, output });
  console.log(output);
}
