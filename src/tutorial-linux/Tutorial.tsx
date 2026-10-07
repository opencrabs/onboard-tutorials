// L1 "Install OpenCrabs on Ubuntu 24.04+": drawn terminal, chapter checklist, copy card, burned-in subtitles.
// Everything is driven by timeline.json (scripts/tutorial-linux/build_timeline.mjs). Illustrative terminal, nothing was recorded.
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS } from "../theme";
import { Card } from "./Cards";
import { activeOf, beatAt, chapterAt, promptOpenAt, screenAt, T, terminalAt, type Line } from "./state";
import { Wizard } from "./Wizard";

export const FPS = T.fps;
export const TOTAL = Math.ceil(T.total * FPS);
export const W = 1920, H = 1080;

const O = "#d76414";
const TERM = { left: 40, top: 96, width: 1360, height: 800, bar: 50, padX: 28, padY: 22 };
const FS = 25, LH = 36, CW = FS * 0.602;
const COLS = Math.floor((TERM.width - TERM.padX * 2) / CW);
const ROWS = Math.floor((TERM.height - TERM.bar - TERM.padY * 2) / LH);
const U = { bg: "#1d1b22", green: "#33d17a", blue: "#62a0ea" };

const rowsOf = (l: Line) => Math.max(1, Math.ceil(((l.kind === "prompt" ? T.prompt.length : 0) + l.text.length + (l.cursor ? 1 : 0)) / COLS));

const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  return <span style={{ background: f % 30 < 16 ? "#e8e8e8" : "transparent", color: "transparent" }}>_</span>;
};

const LineView: React.FC<{ l: Line; hi: boolean }> = ({ l, hi }) => {
  const base: React.CSSProperties = { whiteSpace: "pre-wrap", wordBreak: "break-all", minHeight: LH, borderRadius: 6, background: hi ? O + "38" : "transparent", boxShadow: hi ? `0 0 0 3px ${O}` : "none" };
  if (l.kind === "prompt") {
    return (
      <div style={base}>
        <span style={{ color: U.green, fontWeight: 700 }}>you@ubuntu</span><span>:</span><span style={{ color: U.blue, fontWeight: 700 }}>~</span><span>$ </span>
        {l.text}{l.cursor && <Cursor />}
      </div>
    );
  }
  if (l.kind === "pw") return <div style={base}>{l.text}{l.cursor && <Cursor />}</div>;
  if (l.text.startsWith("~")) return <div style={{ ...base, color: "#77767b", fontStyle: "italic" }}>{l.text.slice(1)}</div>;
  if (l.text.startsWith("@")) return <div style={{ ...base, color: U.green, fontWeight: 700 }}>{l.text.slice(1)}</div>;
  return <div style={base}>{l.text}</div>;
};

const Terminal: React.FC<{ t: number }> = ({ t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = promptOpenAt();
  const p = spring({ frame: f - Math.round(open * fps), fps, config: { damping: 16, stiffness: 140 } });
  const all = terminalAt(t);
  const lines: Line[] = [];
  let rows = 0;
  for (let i = all.length - 1; i >= 0; i--) {
    rows += rowsOf(all[i]);
    if (rows > ROWS) break;
    lines.unshift(all[i]);
  }
  const zoom = activeOf(t, "zoom");
  let hiIdx = -1;
  if (zoom) lines.forEach((l, i) => { if (l.text.includes(zoom.zoom!)) hiIdx = i; });
  const hiTop = hiIdx < 0 ? 0 : lines.slice(0, hiIdx).reduce((n, l) => n + rowsOf(l), 0) * LH;
  const zp = zoom ? spring({ frame: f - Math.round(zoom.at * fps), fps, config: { damping: 14 } }) : 0;
  const screen = screenAt(t);
  return (
    <div style={{ position: "absolute", left: TERM.left, top: TERM.top, width: TERM.width, height: TERM.height, borderRadius: 14, overflow: "hidden", background: U.bg, boxShadow: "0 30px 90px rgba(0,0,0,.55)", border: "1px solid #3a3842", opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})` }}>
      <div style={{ height: TERM.bar, background: "#2b2930", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: 21, color: "#d8d8dc" }}>
        you@ubuntu: ~
        <div style={{ position: "absolute", right: 16, width: 26, height: 26, borderRadius: 13, background: "#45434b", color: "#ddd", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
      </div>
      <div style={{ position: "absolute", top: TERM.bar, left: 0, right: 0, bottom: 0 }}>
        {screen ? (
          <Wizard id={screen.id} dt={t - screen.at} />
        ) : (
          <div style={{ position: "absolute", inset: `${TERM.padY}px ${TERM.padX}px`, fontFamily: MONO, fontSize: FS, lineHeight: `${LH}px`, color: "#e8e8e8" }}>
            {lines.map((l, i) => <LineView key={i} l={l} hi={i === hiIdx} />)}
            {zoom && hiIdx >= 0 && (
              <div style={{ position: "absolute", right: 0, top: hiTop - 4, transform: `translateX(${interpolate(zp, [0, 1], [40, 0])}px)`, opacity: zp, background: O, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 26, padding: "6px 18px", borderRadius: 22 }}>
                ← {zoom.note}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 8, fontFamily: SANS, fontSize: 15, color: "#ffffff66" }}>illustrative terminal · recreated UI</div>
    </div>
  );
};

const Side: React.FC<{ t: number }> = ({ t }) => {
  const ch = chapterAt(t);
  const copy = beatAt(t).copy;
  return (
    <div style={{ position: "absolute", left: 1430, top: 96, width: 450, height: 800, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ background: C.panel, border: `2px solid ${C.line}`, borderRadius: 18, padding: "22px 24px" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: C.dim, letterSpacing: 2, marginBottom: 12 }}>STEPS</div>
        {T.chapters.filter((c) => c.n > 0).map((c) => {
          const done = t >= c.end, cur = c.n === ch.n;
          return (
            <div key={c.n} style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: SANS, fontSize: 23, lineHeight: "40px", color: cur ? "#fff" : done ? C.green : C.dim, fontWeight: cur ? 800 : 500 }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, background: cur ? O : done ? C.green + "33" : C.panel2, color: done && !cur ? C.green : "#fff" }}>{done && !cur ? "✓" : c.n}</span>
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
            </div>
          );
        })}
      </div>
      {copy && (
        <div style={{ background: C.panel, border: `2px solid ${O}66`, borderRadius: 18, padding: "20px 24px" }}>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 20, color: O, letterSpacing: 2, marginBottom: 10 }}>COPY THIS</div>
          <div style={{ fontFamily: MONO, fontSize: copy.length > 90 ? 18 : 21, lineHeight: 1.45, color: C.text, wordBreak: "break-all" }}>{copy}</div>
          <div style={{ fontFamily: SANS, fontSize: 17, color: C.dim, marginTop: 10 }}>also in the description</div>
        </div>
      )}
    </div>
  );
};

const TopBar: React.FC<{ t: number }> = ({ t }) => {
  const ch = chapterAt(t);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 26, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 26, color: C.dim }}>
      <div><span style={{ color: O, fontWeight: 800 }}>🦀 OpenCrabs</span>  ·  Install on Ubuntu 24.04+</div>
      {ch.n > 0 && <div><span style={{ color: C.text, fontWeight: 700 }}>Step {ch.n}/9</span>  ·  {ch.title}</div>}
    </div>
  );
};

const Subtitle: React.FC<{ t: number }> = ({ t }) => {
  const c = T.cues.find((q) => q.start <= t && t < q.end + 0.15);
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 918, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1720, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 36, lineHeight: 1.3, color: "#fff", background: "rgba(0,0,0,.72)", padding: "10px 26px", borderRadius: 12 }}>{c.text}</div>
    </div>
  );
};

const ChapterBanner: React.FC<{ t: number }> = ({ t }) => {
  const ch = chapterAt(t);
  const dt = t - ch.start;
  if (ch.n === 0 || dt > 2.4) return null;
  const o = interpolate(dt, [0, 0.3, 2.0, 2.4], [0, 1, 1, 0]);
  return (
    <div style={{ position: "absolute", left: TERM.left, width: TERM.width, top: TERM.top + TERM.height / 2 - 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(10,14,21,.92)", border: `3px solid ${O}`, borderRadius: 22, padding: "22px 46px", fontFamily: SANS, textAlign: "center", transform: `scale(${interpolate(o, [0, 1], [0.94, 1])})` }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 4, color: O }}>STEP {ch.n}</div>
        <div style={{ fontSize: 56, fontWeight: 800, color: "#fff" }}>{ch.title}</div>
      </div>
    </div>
  );
};

const Title: React.FC<{ t: number }> = ({ t }) => {
  if (t > promptOpenAt() + 0.6 || activeOf(t, "card")) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: SANS, textAlign: "center" }}>
      <div style={{ fontSize: 120 }}>🦀</div>
      <div style={{ fontSize: 84, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Install OpenCrabs on Ubuntu</div>
      <div style={{ fontSize: 36, color: C.dim, marginTop: 16 }}>Ubuntu 24.04+ · from zero to your first chat</div>
    </AbsoluteFill>
  );
};

const Shortcut: React.FC<{ t: number }> = ({ t }) => {
  const s = T.vo.find((v) => v.id === "c0c")!.start, e = promptOpenAt();
  if (t < s + 1.2 || t > e) return null;
  const k = (x: string) => <span style={{ display: "inline-block", background: C.panel2, border: `2px solid ${C.line}`, borderBottomWidth: 7, borderRadius: 14, padding: "10px 30px", margin: "0 12px", color: "#fff" }}>{x}</span>;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 220, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.dim, background: "rgba(6,9,14,.6)" }}>
      <div>{k("Ctrl")}+{k("Alt")}+{k("T")}</div>
    </AbsoluteFill>
  );
};

export const Tutorial: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const card = activeOf(t, "card");
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, #2a1630 0%, ${C.bg} 60%)` }}>
      <Audio src={staticFile("audio/tutorial-linux/mix.wav")} />
      <Title t={t} />
      <TopBar t={t} />
      <Terminal t={t} />
      <Side t={t} />
      <ChapterBanner t={t} />
      {card && <div style={{ position: "absolute", left: TERM.left, top: TERM.top, width: TERM.width, height: TERM.height, borderRadius: 14, overflow: "hidden" }}><Card id={card.card!} at={card.at} t={t} /></div>}
      <Shortcut t={t} />
      <Subtitle t={t} />
    </AbsoluteFill>
  );
};
