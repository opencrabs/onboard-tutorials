// Pure helpers: what the terminal shows at time t, derived from timeline.json.
import TL from "./timeline.json";

export type Act = {
  at: number; chapter: number; cmd?: string; type?: number; out?: string[]; gap?: number; pw?: boolean;
  prompt?: boolean; wait?: number; screen?: string; dur?: number; zoom?: string; note?: string; card?: string;
};
export type Line = { kind: "prompt" | "out" | "pw"; text: string; done?: boolean; cursor?: boolean };

export const T = TL as unknown as {
  fps: number; total: number; prompt: string;
  chapters: { n: number; title: string; start: number; end: number }[];
  beats: { chapter: number; id: string; start: number; end: number; copy: string | null }[];
  actions: Act[];
  vo: { id: string; start: number; dur: number; sub: string }[];
  cues: { start: number; end: number; text: string }[];
};

export const terminalAt = (t: number): Line[] => {
  const lines: Line[] = [];
  const last = () => lines[lines.length - 1];
  const ensurePrompt = () => {
    const l = last();
    if (!(l && l.kind === "prompt" && l.text === "" && !l.done)) lines.push({ kind: "prompt", text: "" });
  };
  for (const a of T.actions) {
    if (a.at > t) break;
    if (a.prompt) ensurePrompt();
    else if (a.cmd) {
      ensurePrompt();
      const p = Math.min(1, (t - a.at) / (a.type ?? 1));
      last().text = a.cmd.slice(0, Math.floor(a.cmd.length * p));
      if (t >= a.at + (a.type ?? 1) + 0.2) last().done = true;
    } else if (a.out) {
      const g = a.gap ?? 0.07;
      const n = Math.min(a.out.length, Math.floor((t - a.at) / g) + 1);
      for (const s of a.out.slice(0, n)) lines.push({ kind: "out", text: s });
      if (t >= a.at + a.out.length * g + 0.15) ensurePrompt();
    } else if (a.pw) {
      lines.push({ kind: "pw", text: "[sudo] password for you: ", done: t >= a.at + 1.2 });
    }
  }
  const l = last();
  if (l && !l.done) l.cursor = true;
  return lines;
};

export const screenAt = (t: number): { id: string; at: number } | null => {
  let s: { id: string; at: number } | null = null;
  for (const a of T.actions) {
    if (a.at > t) break;
    if (a.screen) s = { id: a.screen, at: a.at };
  }
  return s;
};

export const activeOf = <K extends "zoom" | "card">(t: number, key: K) =>
  T.actions.filter((a) => a[key] && a.at <= t && t < a.at + (a.dur ?? 0)).pop() ?? null;

export const promptOpenAt = () => T.actions.find((a) => a.prompt || a.cmd)!.at;
export const chapterAt = (t: number) => [...T.chapters].reverse().find((c) => c.start <= t + 0.001) ?? T.chapters[0];
export const beatAt = (t: number) => [...T.beats].reverse().find((b) => b.start <= t) ?? T.beats[0];
export const voAt = (id: string) => T.vo.find((v) => v.id === id)!;
