// The OpenCrabs setup wizard and first chat, redrawn from src/tui/onboarding_render.rs
// (step titles/subtitles from onboarding/types.rs, health checks from onboarding/config.rs).
// The screens are the same on every OS; only the home path and the daemon line differ (WizardOS).
import React from "react";
import { MONO } from "../theme";

export const K = { bg: "#0c0c0f", orange: "#d76414", gold: "#e0a84a", text: "#c8c8d2", gray: "#8c8ca0", dim: "#50505f", teal: "#3fb9a6", user: "#4f8cff" };

const BANNER = [
  "   ___                    ___           _",
  "  / _ \\ _ __  ___ _ _    / __|_ _ __ _| |__  ___",
  " | (_) | '_ \\/ -_) ' \\  | (__| '_/ _` | '_ \\(_-<",
  "  \\___/| .__/\\___|_||_|  \\___|_| \\__,_|_.__//__/",
  "       |_|",
];

const STEPS: Record<string, { title: string; sub: string }> = {
  "wiz-mode": { title: "Pick Your Vibe", sub: "Quick and easy or full control — your call" },
  "wiz-home": { title: "Home Base", sub: "Where my brain lives on disk" },
  "wiz-provider": { title: "Brain Fuel", sub: "Pick your AI model and drop your key" },
  "wiz-key": { title: "Brain Fuel", sub: "Pick your AI model and drop your key" },
  "wiz-model": { title: "Brain Fuel", sub: "Pick your AI model and drop your key" },
  "wiz-daemon": { title: "Always On", sub: "Keep me running in the background" },
  "wiz-health": { title: "Vibe Check", sub: "Making sure everything's wired up right" },
  "wiz-brain": { title: "Make It Yours", sub: "Make me yours, drop some context so I actually get you" },
};

const S: React.FC<{ c?: string; b?: boolean; children: React.ReactNode }> = ({ c = K.text, b, children }) => (
  <span style={{ color: c, fontWeight: b ? 700 : 400 }}>{children}</span>
);
const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div style={{ whiteSpace: "pre", minHeight: 34 }}>{children ?? " "}</div>;

const Opt: React.FC<{ sel: boolean; mark?: "[]" | "()"; label: string; desc?: string }> = ({ sel, mark = "[]", label, desc }) => (
  <>
    <Row>
      <S c={K.gold}>{sel ? " > " : "   "}</S>
      <S c={sel ? K.gold : K.gray}>{mark === "[]" ? (sel ? "[*]" : "[ ]") : sel ? "(*)" : "( )"}</S>
      <S c={sel ? K.text : K.gray} b={sel}>{" " + label}</S>
    </Row>
    {desc && <Row><S c={K.gray}>{"       " + desc}</S></Row>}
  </>
);

// Provider order from onboarding/types.rs; the list window is scrolled so z.ai sits in view.
const PROVIDERS = ["GitHub Copilot", "Google Gemini", "OpenRouter", "Minimax", "z.ai", "Moonshot AI"];
const ZAI = PROVIDERS.indexOf("z.ai");
// The real wizard fetches this list live from z.ai; these are its current GLM ids.
const MODELS = ["glm-5.3", "glm-5.3-flash", "glm-5.2"];
const CHECKS = ["API Key Present", "Config File", "Workspace Directory", "Template Files"];

// keyAt: seconds into the key screen before the masked key starts typing (a fast-forwarded wizard types it sooner).
export type WizardOS = { home: string; daemon: string; keyAt?: number };

const Body: React.FC<{ id: string; dt: number; os: WizardOS }> = ({ id, dt, os }) => {
  switch (id) {
    case "wiz-mode":
      return (<>
        <Opt sel label="QuickStart" desc="Sensible defaults, 4 steps" />
        <Row />
        <Opt sel={false} label="Advanced" desc="Full control, all 7 steps" />
      </>);
    case "wiz-home":
      return (<>
        <Row><S c={K.gray}>  Path: </S><S>{os.home}</S><S c={K.gold}>█</S></Row>
        <Row />
        <Row><S c={K.gold}>  [x]</S><S c={K.gray}> Seed template files</S></Row>
        <Row><S c={K.gray}>      SOUL.md, USER.md, ...</S></Row>
      </>);
    case "wiz-provider":
    case "wiz-key":
    case "wiz-model": {
      const keyTyped = id === "wiz-key" ? Math.min(26, Math.max(0, Math.floor((dt - (os.keyAt ?? 3.9)) * 18))) : 26;
      return (<>
        {id !== "wiz-model" && <Row><S c={K.gray}>   ↑ more</S></Row>}
        {(id === "wiz-model" ? PROVIDERS.slice(ZAI, ZAI + 1) : PROVIDERS).map((p) => {
          const on = p === "z.ai";
          return (
            <Row key={p}>
              <S c={K.gold}>{on && id === "wiz-provider" ? " > " : "   "}</S>
              <S c={on ? K.gold : K.gray}>{on ? "[*]" : "[ ]"}</S>
              <S c={on ? K.text : K.gray} b={on}>{" " + p}</S>
            </Row>
          );
        })}
        {id !== "wiz-model" && <Row><S c={K.gray}>   ↓ more</S></Row>}
        {id !== "wiz-provider" && (<>
          <Row><S c={K.gray}>  Get key from open.bigmodel.cn</S></Row>
          <Row />
          <Row><S c={K.gray}>  Endpoint Type:</S></Row>
          <Row><S c={K.gray}>    [ ] General API  </S><S c={K.gold} b>[*] Coding API</S></Row>
          <Row />
          <Row><S c={K.gray}>  API Key: </S><S c={K.gold}>{"*".repeat(keyTyped)}</S>{id === "wiz-key" && <S c={K.gold}>█</S>}</Row>
        </>)}
        {id === "wiz-model" && (<>
          <Row />
          <Row><S c={K.gray}>  Model:</S></Row>
          {MODELS.map((m, i) => <Opt key={m} sel={i === 0} mark="()" label={m} />)}
        </>)}
      </>);
    }
    case "wiz-daemon":
      return (<>
        <Row><S c={K.gray}>{"  " + os.daemon}</S></Row>
        <Row />
        <Opt sel={false} mark="()" label="Yes, install daemon" />
        <Opt sel mark="()" label="Skip for now" />
      </>);
    case "wiz-health": {
      const n = Math.floor(dt / 0.45);
      return (<>
        {CHECKS.map((c, i) => (
          <Row key={c}><S c={i < n ? K.teal : K.gold} b>{i < n ? "  [OK  ] " : "  [... ] "}</S><S>{c}</S></Row>
        ))}
        <Row />
        {n >= CHECKS.length && <Row><S c={K.teal} b>  All checks passed!</S></Row>}
        {n >= CHECKS.length && <Row><S c={K.gray}>  Press Enter to finish setup</S></Row>}
      </>);
    }
    case "wiz-brain":
      return (<>
        <Row><S c={K.text} b>  About You:</S></Row>
        <Row><S c={K.dim}>  name, role, links, projects, whatever you got</S></Row>
        <Row />
        <Row><S c={K.text} b>  Your OpenCrabs:</S></Row>
        <Row><S c={K.dim}>  personality, vibe, how I should talk to you</S></Row>
        <Row />
        <Row><S c={K.gray}>  Esc to skip · Tab to switch · Enter to generate</S></Row>
      </>);
    default:
      return null;
  }
};

const Frame: React.FC<{ title: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, children, footer }) => (
  <div style={{ position: "absolute", inset: "18px 18px 34px 18px", border: `2px solid ${K.orange}`, borderRadius: 10, padding: "30px 34px", display: "flex", flexDirection: "column" }}>
    <div style={{ position: "absolute", top: -17, left: 28, background: K.bg, padding: "0 8px", color: K.orange, fontWeight: 700 }}>{title}</div>
    <div style={{ flex: 1 }}>{children}</div>
    {footer}
  </div>
);

const Keys: React.FC<{ keys: [string, string][] }> = ({ keys }) => (
  <Row>{keys.map(([k, v]) => <React.Fragment key={k}><S c={K.user} b>{`[${k}] `}</S><S c={K.text}>{v + "  "}</S></React.Fragment>)}</Row>
);

export const Wizard: React.FC<{ id: string; dt: number; os: WizardOS }> = ({ id, dt, os }) => {
  const base: React.CSSProperties = { position: "absolute", inset: 0, background: K.bg, fontFamily: MONO, fontSize: 24, lineHeight: "34px", color: K.text };
  if (id === "chat") return <Chat dt={dt} />;
  if (id === "wiz-done") {
    return (
      <div style={base}>
        <Frame title=" OpenCrabs Setup Complete ">
          <Row /><Row /><Row><S c={K.gold} b>Setup complete!</S></Row><Row />
          <Row><S c={K.gray}>  Provider: </S><S b>z.ai</S></Row>
          <Row><S c={K.gray}>  Model:    </S><S b>{MODELS[0]}</S></Row>
          <Row><S c={K.gray}>  Workspace:</S><S>{" " + os.home}</S></Row>
          <Row /><Row /><Row><S c={K.gold} b><i>Entering OpenCrabs...</i></S></Row>
        </Frame>
      </div>
    );
  }
  const st = STEPS[id];
  return (
    <div style={base}>
      <Frame title=" OpenCrabs Setup " footer={<Keys keys={id === "wiz-brain" ? [["Esc", "Skip"], ["Enter", "Confirm"]] : [["Esc", "Back"], ["Enter", "Confirm"]]} />}>
        {id === "wiz-mode" && (<>
          {BANNER.map((b, i) => <Row key={i}><S c={K.orange} b>{b}</S></Row>)}
          <Row><S c={K.gray}>{"🦀 The autonomous AI agent. Self-improving. Every channel."}</S></Row>
          <Row />
        </>)}
        <Row><S c={K.gold} b>{st.title}</S></Row>
        <Row><S c={K.gray}>{st.sub}</S></Row>
        <Row />
        <Body id={id} dt={dt} os={os} />
      </Frame>
    </div>
  );
};

// First chat: "hi" typed, an example reply streams in (labelled, it is not real model output).
const REPLY = "Hey! I'm OpenCrabs, running on your machine. Ask me to fix a bug, read a file, or plan a project. What are we building?";
const Chat: React.FC<{ dt: number }> = ({ dt }) => {
  const hiTyped = "hi".slice(0, Math.max(0, Math.floor((dt - 0.3) * 6)));
  const sent = dt > 0.9;
  const replyN = Math.max(0, Math.floor((dt - 1.6) * 55));
  return (
    <div style={{ position: "absolute", inset: 0, background: K.bg, fontFamily: MONO, fontSize: 24, lineHeight: "34px", color: K.text, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 28px", borderBottom: `2px solid ${K.dim}`, display: "flex", justifyContent: "space-between" }}>
        <S c={K.orange} b>🦀 OpenCrabs</S><S c={K.gray}>zai · {MODELS[0]}</S>
      </div>
      <div style={{ flex: 1, padding: "26px 34px", display: "flex", flexDirection: "column", gap: 22, justifyContent: "flex-end" }}>
        {sent && <div><S c={K.user} b>you  </S><S>hi</S></div>}
        {replyN > 0 && (
          <div style={{ whiteSpace: "pre-wrap" }}>
            <S c={K.orange} b>🦀  </S><S>{REPLY.slice(0, replyN)}</S>
            <div style={{ marginTop: 8, fontSize: 18, color: K.gold }}>example reply · yours will differ</div>
          </div>
        )}
      </div>
      <div style={{ borderTop: `2px solid ${K.dim}`, padding: "16px 28px" }}>
        <S c={K.orange}>❯ </S><S>{sent ? "" : hiTyped}</S><S c={K.gold}>█</S>
      </div>
    </div>
  );
};
