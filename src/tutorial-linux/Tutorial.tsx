// L1 "Install OpenCrabs on Ubuntu 24.04+" on the shared episode engine.
// Everything is driven by timeline.json (scripts/engine/build_timeline.mjs tutorial-linux). Illustrative terminal, nothing was recorded.
import React from "react";
import { AbsoluteFill } from "remotion";
import { durationOf, Episode, H, W, useEpisode, type EpisodeConfig } from "../engine/Episode";
import { ubuntu } from "../engine/skins";
import type { Timeline } from "../engine/state";
import { C, SANS } from "../theme";
import { Body } from "./Cards";
import TL from "./timeline.json";

const T = TL as unknown as Timeline;
export const FPS = T.fps;
export const TOTAL = durationOf(T);
export { W, H };

const Shortcut: React.FC<{ t: number }> = ({ t }) => {
  const { s } = useEpisode();
  const st = s.voAt("c0c").start, e = s.promptOpenAt();
  if (t < st + 1.2 || t > e) return null;
  const k = (x: string) => <span style={{ display: "inline-block", background: C.panel2, border: `2px solid ${C.line}`, borderBottomWidth: 7, borderRadius: 14, padding: "10px 30px", margin: "0 12px", color: "#fff" }}>{x}</span>;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 220, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.dim, background: "rgba(6,9,14,.6)" }}>
      <div>{k("Ctrl")}+{k("Alt")}+{k("T")}</div>
    </AbsoluteFill>
  );
};

const cfg: EpisodeConfig = {
  timeline: T,
  audio: "audio/tutorial-linux/mix.wav",
  heading: "Install on Ubuntu 24.04+",
  skin: ubuntu,
  os: { home: "/home/you/.opencrabs", daemon: "Install as systemd user unit ?" },
  title: (<>
    <div style={{ fontSize: 120 }}>🦀</div>
    <div style={{ fontSize: 84, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Install OpenCrabs on Ubuntu</div>
    <div style={{ fontSize: 36, color: C.dim, marginTop: 16 }}>Ubuntu 24.04+ · one paste, from zero to your first chat</div>
  </>),
  cards: Body,
  overlays: Shortcut,
};

export const Tutorial: React.FC = () => <Episode cfg={cfg} />;
