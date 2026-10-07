// Overlay cards shown over the terminal (need, block, arm, pw, key, again, errors, next).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS } from "../theme";
import { beatAt } from "./state";
import { BLOCK_LINES } from "./block";

const O = "#d76414";
const Mono: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.text }) => (
  <div style={{ fontFamily: MONO, fontSize: 26, color: c, background: "#0b0f16", border: `2px solid ${C.line}`, borderRadius: 12, padding: "14px 20px", wordBreak: "break-all", lineHeight: 1.45 }}>{children}</div>
);
const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.text, marginBottom: 28, letterSpacing: -0.5 }}>{children}</div>
);
const Item: React.FC<{ icon: string; children: React.ReactNode; c?: string }> = ({ icon, children, c = C.text }) => (
  <div style={{ display: "flex", gap: 22, alignItems: "baseline", fontFamily: SANS, fontSize: 34, color: c, marginBottom: 20 }}>
    <span style={{ width: 44, textAlign: "center" }}>{icon}</span><div style={{ flex: 1 }}>{children}</div>
  </div>
);
const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.text, background: C.panel2, border: `2px solid ${C.line}`, borderBottomWidth: 6, borderRadius: 12, padding: "6px 22px", margin: "0 8px" }}>{children}</span>
);

const ERRORS = [
  { id: "c8b", err: "GLIBC_2.39 not found", fix: "System too old for this download → watch the older-systems video" },
  { id: "p4c", err: "libgomp.so.1: cannot open shared object file", fix: "Helpers missing → paste the install block again" },
  { id: "p4d", err: "gzip: unexpected end of file", fix: "Version lookup came back empty → wait a moment, paste the block again" },
];

const Body: React.FC<{ id: string; t: number }> = ({ id, t }) => {
  switch (id) {
    case "need":
      return (<>
        <H>What you need</H>
        <Item icon="🐧">Ubuntu <b>24.04 or newer</b>, 64-bit</Item>
        <Item icon="🌐">An internet connection</Item>
        <Item icon="🔑">A key or subscription from an AI provider</Item>
        <Item icon="⏱" c={C.dim}>About 2 minutes, one paste</Item>
      </>);
    case "block":
      return (<>
        <H>One paste installs it</H>
        <Mono>{BLOCK_LINES.map((l, i) => <div key={i} style={{ fontSize: 21 }}>{l}</div>)}</Mono>
        <div style={{ fontFamily: SANS, fontSize: 28, color: C.dim, marginTop: 22 }}>docs.opencrabs.com → Installation → Linux (amd64) · also in the description</div>
      </>);
    case "arm":
      return (<>
        <H>ARM machine? Use the arm64 block</H>
        <Item icon="↔">Same block, with <b style={{ color: C.red }}>amd64</b> swapped for <b style={{ color: C.green }}>arm64</b>:</Item>
        <Mono>…/opencrabs-${"{TAG}"}-linux-<span style={{ color: C.green, fontWeight: 700 }}>arm64</span>.tar.gz</Mono>
        <div style={{ fontFamily: SANS, fontSize: 28, color: C.dim, marginTop: 22 }}>docs.opencrabs.com → Installation → Linux (arm64)</div>
      </>);
    case "pw":
      return (<>
        <H>Typing your password shows nothing</H>
        <Item icon="👀">No dots, no stars. That's normal on Linux.</Item>
        <Item icon="⏎">Type it, then press <Key>Enter</Key></Item>
      </>);
    case "key":
      return (<>
        <H>Your key stays hidden</H>
        <Item icon="🔒">It shows as <span style={{ fontFamily: MONO, color: "#e0a84a" }}>**********</span> while you paste</Item>
        <Item icon="🚫">Never share your key, never post it in a chat</Item>
        <Item icon="🎬" c={C.dim}>No real key appears anywhere in this video</Item>
      </>);
    case "again":
      return (<>
        <H>Next time</H>
        <Item icon="⌨">Open a terminal in your home folder and run:</Item>
        <Mono c={C.green}>./opencrabs</Mono>
        <Item icon="🦀" c={C.dim}>{" "}Your setup and chats are saved in ~/.opencrabs</Item>
      </>);
    case "errors": {
      const cur = beatAt(t).id;
      return (<>
        <H>If something breaks</H>
        {ERRORS.map((e) => {
          const on = e.id === cur;
          return (
            <div key={e.id} style={{ marginBottom: 22, padding: "16px 22px", borderRadius: 14, border: `2px solid ${on ? O : C.line}`, background: on ? O + "1f" : "transparent", opacity: on || cur === "c8a" ? 1 : 0.45 }}>
              <div style={{ fontFamily: MONO, fontSize: 28, color: C.red }}>{e.err}</div>
              <div style={{ fontFamily: SANS, fontSize: 30, color: C.text, marginTop: 8 }}>{e.fix}</div>
            </div>
          );
        })}
      </>);
    }
    case "next":
      return (<>
        <H>You're installed 🦀</H>
        <Item icon="📋">Every command is in the description</Item>
        <Item icon="→" c={O}><b>Next:</b> keep OpenCrabs running in the background</Item>
        <Item icon="→" c={O}><b>Then:</b> connect Telegram and chat from your phone</Item>
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 26, color: C.dim }}>docs.opencrabs.com · github.com/opencrabs/opencrabs</div>
      </>);
    default:
      return null;
  }
};

export const Card: React.FC<{ id: string; at: number; t: number }> = ({ id, at, t }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - Math.round(at * fps), fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(6,9,14,${0.72 * p})` }}>
      <div style={{ width: 1060, padding: "46px 56px", background: C.panel, border: `2px solid ${O}88`, borderRadius: 26, boxShadow: "0 30px 80px rgba(0,0,0,.5)", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
        <Body id={id} t={t} />
      </div>
    </div>
  );
};
