// Terminal window looks per OS: window chrome, colours and how the shell prompt is drawn.
import React from "react";
import { SANS } from "../theme";

export type Skin = {
  bg: string; text: string; border: string; title: string;
  bar: React.FC<{ title: string; height: number }>;
  prompt: React.FC;
  green: string; dim: string;
};

const U = { bg: "#1d1b22", green: "#33d17a", blue: "#62a0ea" };

// GNOME Terminal on Ubuntu: centred title, round close button on the right, user@host:~$ prompt.
export const ubuntu: Skin = {
  bg: U.bg, text: "#e8e8e8", border: "#3a3842", title: "you@ubuntu: ~", green: U.green, dim: "#77767b",
  bar: ({ title, height }) => (
    <div style={{ height, background: "#2b2930", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: SANS, fontWeight: 700, fontSize: 21, color: "#d8d8dc" }}>
      {title}
      <div style={{ position: "absolute", right: 16, width: 26, height: 26, borderRadius: 13, background: "#45434b", color: "#ddd", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
    </div>
  ),
  prompt: () => (<>
    <span style={{ color: U.green, fontWeight: 700 }}>you@ubuntu</span><span>:</span><span style={{ color: U.blue, fontWeight: 700 }}>~</span><span>$ </span>
  </>),
};

// Terminal.app on macOS: traffic lights on the left, centred title, zsh `user@host ~ %` prompt.
export const macos: Skin = {
  bg: "#1e1e1e", text: "#e8e8e8", border: "#3d3d3d", title: "you — -zsh — 120×30", green: "#32d74b", dim: "#8a8a8e",
  bar: ({ title, height }) => (
    <div style={{ height, background: "#2d2d2d", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontFamily: SANS, fontWeight: 600, fontSize: 20, color: "#b8b8bc" }}>
      <div style={{ position: "absolute", left: 18, display: "flex", gap: 10 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
      </div>
      {title}
    </div>
  ),
  prompt: () => <span>you@MacBook ~ % </span>,
};
