// Writes vo_lines.json (id, text) from episode.mjs for scripts/vo.sh.
import fs from "node:fs";
import { CHAPTERS } from "./episode.mjs";
const lines = CHAPTERS.flatMap((c) => c.beats.filter((b) => b.vo).map((b) => ({ id: b.vo.id, text: b.vo.say })));
fs.writeFileSync(new URL("./vo_lines.json", import.meta.url), JSON.stringify(lines, null, 1) + "\n");
const words = lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0);
console.log(lines.length, "lines,", words, "words");
