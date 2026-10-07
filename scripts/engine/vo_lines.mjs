// Writes scripts/<episode>/vo_lines.json (id, text) from its episode.mjs for scripts/vo.sh: node scripts/engine/vo_lines.mjs <episode>
import fs from "node:fs";
const KEY = process.argv[2];
if (!KEY) throw new Error("usage: vo_lines.mjs <episode>");
const DIR = new URL(`../${KEY}/`, import.meta.url);
const { CHAPTERS } = await import(new URL("episode.mjs", DIR));
const lines = CHAPTERS.flatMap((c) => c.beats.filter((b) => b.vo).map((b) => ({ id: b.vo.id, text: b.vo.say })));
fs.writeFileSync(new URL("vo_lines.json", DIR), JSON.stringify(lines, null, 1) + "\n");
const words = lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
console.log(lines.length, "lines,", words, "words");
