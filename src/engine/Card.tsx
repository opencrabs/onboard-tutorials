// Overlay card shell shown over the terminal, plus the building blocks episodes compose their card bodies from.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, MONO, SANS } from "../theme";

export const O = "#d76414";
export const Mono: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.text }) => (
  <div style={{ fontFamily: MONO, fontSize: 26, color: c, background: "#0b0f16", border: `2px solid ${C.line}`, borderRadius: 12, padding: "14px 20px", wordBreak: "break-all", lineHeight: 1.45 }}>{children}</div>
);
export const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 48, color: C.text, marginBottom: 28, letterSpacing: -0.5 }}>{children}</div>
);
export const Item: React.FC<{ icon: string; children: React.ReactNode; c?: string }> = ({ icon, children, c = C.text }) => (
  <div style={{ display: "flex", gap: 22, alignItems: "baseline", fontFamily: SANS, fontSize: 34, color: c, marginBottom: 20 }}>
    <span style={{ width: 44, textAlign: "center" }}>{icon}</span><div style={{ flex: 1 }}>{children}</div>
  </div>
);
export const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.text, background: C.panel2, border: `2px solid ${C.line}`, borderBottomWidth: 6, borderRadius: 12, padding: "6px 22px", margin: "0 8px" }}>{children}</span>
);

// "See this instead?": an error shown at the step where it fails, with its cause and fix.
export const Fail: React.FC<{ err: string; why: string; fix: string }> = ({ err, why, fix }) => (<>
  <H>See this instead?</H>
  <div style={{ padding: "16px 22px", borderRadius: 14, border: `2px solid ${C.red}`, background: C.red + "14", marginBottom: 26 }}>
    <div style={{ fontFamily: MONO, fontSize: 28, color: C.red }}>{err}</div>
  </div>
  <Item icon="?">{why}</Item>
  <Item icon="✓" c={C.green}>{fix}</Item>
</>);

export const Card: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - Math.round(at * fps), fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(6,9,14,${0.72 * p})` }}>
      <div style={{ width: 1060, padding: "46px 56px", background: C.panel, border: `2px solid ${O}88`, borderRadius: 26, boxShadow: "0 30px 80px rgba(0,0,0,.5)", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` }}>
        {children}
      </div>
    </div>
  );
};
