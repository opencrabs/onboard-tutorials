// Turns an episode's episode.mjs + the measured VO durations into absolute times: node scripts/engine/build_timeline.mjs <episode>
// Writes src/<episode>/timeline.json, out/<episode>/{<code>.srt,chapters.txt,description.md}
// and the mixed VO track public/audio/<episode>/mix.wav (-16 LUFS).
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const KEY = process.argv[2];
if (!KEY) throw new Error("usage: build_timeline.mjs <episode>, e.g. tutorial-linux");
const ROOT = new URL("../../", import.meta.url).pathname;
const { CHAPTERS, EPISODE: EP, PROMPT } = await import(`${ROOT}scripts/${KEY}/episode.mjs`);
const AUD = ROOT + `public/audio/${KEY}/`;
const OUT = ROOT + `out/${KEY}/`;
fs.mkdirSync(OUT, { recursive: true });

const dur = (id) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", `${AUD}vo_${id}.wav`]).toString().trim());

const CPS = 32; // typing speed, chars per second
const typeDur = (s) => Math.min(3.2, Math.max(0.5, s.length / CPS));
const LEAD = 2.2;      // opening title before the first line
const BEAT_GAP = 0.55; // breath after each VO line
const CHAPTER_GAP = 1.4; // chapter banner breathing room
const TAIL = 3.0;

let t = LEAD;
const chapters = [], beats = [], actions = [], vo = [];
for (const ch of CHAPTERS) {
  if (ch.n > 0) t += CHAPTER_GAP;
  const chStart = t;
  for (const b of ch.beats) {
    const start = t;
    const d = dur(b.vo.id);
    vo.push({ id: b.vo.id, start, dur: d, sub: b.vo.sub ?? b.vo.say });
    let a = start;
    const toBeat = [];
    for (const act of b.act ?? []) {
      const rec = { ...act, at: a, chapter: ch.n };
      if (act.cmd) { rec.type = act.paste ? 0.12 : typeDur(act.cmd); a += rec.type + (act.paste ? 0.25 : 0.35); }
      else if (act.out) { const g = act.gap ?? 0.07; rec.gap = g; a += act.out.length * g + 0.15; }
      else if (act.pw) a += 1.2;
      else if (act.wait) a += act.wait;
      else if (act.screen) a += act.dur;
      if (act.dur === "beat") toBeat.push(rec);
      actions.push(rec);
    }
    const end = Math.max(start + d + BEAT_GAP, a + 0.3);
    for (const rec of toBeat) rec.dur = end - rec.at;
    beats.push({ chapter: ch.n, id: b.vo.id, start, end, copy: b.copy ?? null });
    t = end;
  }
  chapters.push({ n: ch.n, title: ch.title, start: chStart, end: t, copy: ch.copy });
}
t += TAIL;
const total = t;

// per-chapter "copy this" command: explicit copy > last cmd typed so far in the chapter
for (const b of beats) {
  if (b.copy) continue;
  const ch = chapters.find((c) => c.n === b.chapter);
  if (ch.copy === null) continue;
  if (typeof ch.copy === "string") { b.copy = ch.copy; continue; }
  const cmds = actions.filter((a) => a.cmd && a.chapter === b.chapter && a.at < b.end);
  b.copy = cmds.length ? cmds[cmds.length - 1].cmd : ch.copy ?? null;
}

// subtitle cues: split long lines at sentence boundaries, timed by length
const cues = [];
for (const v of vo) {
  const parts = v.sub.split(/(?<=[.?!]["']?)\s+/).map((s) => s.trim()).filter(Boolean);
  const chunks = [];
  for (const p of parts) {
    const last = chunks[chunks.length - 1];
    if (last && (last + " " + p).length <= 84) chunks[chunks.length - 1] = last + " " + p;
    else chunks.push(p);
  }
  const chars = chunks.reduce((n, c) => n + c.length, 0);
  let s = v.start;
  for (const c of chunks) {
    const d = (v.dur * c.length) / chars;
    cues.push({ start: s, end: s + d, text: c });
    s += d;
  }
}

fs.writeFileSync(ROOT + `src/${KEY}/timeline.json`, JSON.stringify({ fps: 30, total, prompt: PROMPT, ...EP.extra, chapters, beats, actions, vo, cues }, null, 1));

const ts = (x, sep = ",") => {
  const ms = Math.round(x * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}${sep}${String(ms % 1000).padStart(3, "0")}`;
};
fs.writeFileSync(OUT + `${EP.code}.srt`, cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join("\n"));
const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, "0")}`;
const chapterList = chapters.map((c) => `${mmss(c.n === 0 ? 0 : c.start)} ${c.n === 0 ? "Intro" : `${c.n}. ${c.title}`}`).join("\n");
fs.writeFileSync(OUT + "chapters.txt", chapterList + "\n");
fs.writeFileSync(OUT + "description.md", EP.description({ chapterList }));

// mixed VO track
const inputs = vo.flatMap((v) => ["-i", `${AUD}vo_${v.id}.wav`]);
const filt = vo.map((v, i) => `[${i}:a]adelay=${Math.round(v.start * 1000)}:all=1[a${i}]`).join(";") +
  ";" + vo.map((_, i) => `[a${i}]`).join("") + `amix=inputs=${vo.length}:normalize=0,apad=whole_dur=${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[m]`;
execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", filt, "-map", "[m]", "-ac", "2", "-t", total.toFixed(3), AUD + "mix.wav"]);
console.log(`total ${total.toFixed(2)}s, ${chapters.length} chapters, ${beats.length} beats, ${actions.length} actions, ${cues.length} cues`);
console.log(chapterList);
