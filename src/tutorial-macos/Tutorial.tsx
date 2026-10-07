// L2 "Install OpenCrabs on macOS" on the shared episode engine: brew install, then a fast-forward of the L1 wizard.
// Everything is driven by timeline.json (scripts/engine/build_timeline.mjs tutorial-macos). Illustrative terminal, nothing was recorded.
import React from "react";
import { AbsoluteFill } from "remotion";
import { durationOf, Episode, H, TERM, W, useEpisode, type EpisodeConfig } from "../engine/Episode";
import { macos } from "../engine/skins";
import type { Timeline } from "../engine/state";
import { C, SANS } from "../theme";
import { Body } from "./Cards";
import TL from "./timeline.json";

const T = TL as unknown as Timeline;
export const FPS = T.fps;
export const TOTAL = durationOf(T);
export { W, H };

const Overlays: React.FC<{ t: number }> = ({ t }) => {
  const { s } = useEpisode();
  const k = (x: string) => <span style={{ display: "inline-block", background: C.panel2, border: `2px solid ${C.line}`, borderBottomWidth: 7, borderRadius: 14, padding: "10px 30px", margin: "0 12px", color: "#fff" }}>{x}</span>;
  const sp = s.voAt("m0b").start;
  if (t >= sp + 1.0 && t <= s.promptOpenAt()) {
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 220, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.dim, background: "rgba(6,9,14,.6)" }}>
        <div>{k("⌘ Command")}+{k("Space")}<span style={{ marginLeft: 24 }}>→ Terminal</span></div>
      </AbsoluteFill>
    );
  }
  // fast-forward chip while the wizard replays the Linux episode's choices
  const ff0 = s.voAt("m2a").start + 6, ff1 = s.voAt("m2e").start;
  if (t >= ff0 && t < ff1) {
    return (
      <div style={{ position: "absolute", left: TERM.left + TERM.width - 470, top: TERM.top + TERM.bar + 14, width: 440, textAlign: "center", background: "#e0a84a", color: "#1a1206", fontFamily: SANS, fontWeight: 800, fontSize: 26, padding: "8px 0", borderRadius: 22 }}>
        ⏩ fast-forward · same as Linux
      </div>
    );
  }
  return null;
};

const cfg: EpisodeConfig = {
  timeline: T,
  audio: "audio/tutorial-macos/mix.wav",
  heading: "Install on macOS (Apple Silicon)",
  skin: macos,
  os: { home: "/Users/you/.opencrabs", daemon: "Install as LaunchAgent ?", keyAt: 0.4 },
  title: (<>
    <div style={{ fontSize: 120 }}>🦀</div>
    <div style={{ fontSize: 84, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Install OpenCrabs on macOS</div>
    <div style={{ fontSize: 36, color: C.dim, marginTop: 16 }}>Apple Silicon · macOS 15+ · one Homebrew command</div>
  </>),
  cards: Body,
  overlays: Overlays,
  hook: { screen: "chat", dt: 10, until: 3.6 },
};

export const Tutorial: React.FC = () => <Episode cfg={cfg} />;
