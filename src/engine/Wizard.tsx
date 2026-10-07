// The OpenCrabs setup wizard and first chat, redrawn from src/tui/onboarding_render.rs and
// onboarding_layout.rs (#1975-#1980): tinted header/footer bands, the left-side step timeline,
// default theme colours from render/palette.rs. Step titles/subtitles from onboarding/types.rs,
// health checks from onboarding/config.rs. Drawn as a 113x30 terminal, the size where the real
// wizard shows the timeline, the logo, spaced header rows and full band padding.
// The screens are the same on every OS; only the home path and the daemon line differ (WizardOS).
import React from "react";
import { MONO } from "../theme";

// Default theme roles: accent = ORANGE, accent_soft = WHITE, gray = GRAY, gray_dim = GRAY_DIM,
// success = SUCCESS, error = ERROR, surface_panel = SURFACE_PANEL. The wizard's "gold" is the accent.
export const K = { bg: "#0c0c0f", orange: "#d76414", gold: "#d76414", text: "#dcdcdc", gray: "#787878", dim: "#505050", teal: "#3cbcbc", user: "#787878", green: "#50c878", red: "#dc5050", panel: "#1e1e2d" };
const FS = 20, LH = 25, CW = FS * 0.602;
const TIMELINE_COLS = 28;
// QuickStart flow (OnboardingStep::flow_steps): the timeline lists these six.
const FLOW = ["Pick Your Vibe", "Home Base", "Brain Fuel", "Always On", "Vibe Check", "Make It Yours"];
const STEP_NO: Record<string, number> = { "wiz-mode": 1, "wiz-home": 2, "wiz-provider": 3, "wiz-key": 3, "wiz-model": 3, "wiz-daemon": 4, "wiz-health": 5, "wiz-brain": 6, "wiz-done": 7 };

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
const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => <div style={{ whiteSpace: "pre", minHeight: LH }}>{children ?? " "}</div>;

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
        <Opt sel label="QuickStart" desc="Sensible defaults, 6 steps" />
        <Row />
        <Opt sel={false} label="Advanced" desc="Full control, all 9 steps" />
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

// A header/footer band: SURFACE_PANEL tint, a gray rule on the content side, one padding row each side.
const Band: React.FC<{ edge: "top" | "bottom"; children: React.ReactNode }> = ({ edge, children }) => (
  <div style={{ background: K.panel, textAlign: "center", padding: `${LH}px ${CW}px`, [edge === "top" ? "borderBottom" : "borderTop"]: `2px solid ${K.gray}` }}>{children}</div>
);

const Timeline: React.FC<{ cur: number }> = ({ cur }) => {
  const complete = cur > FLOW.length;
  return (
    <div style={{ width: TIMELINE_COLS * CW, flexShrink: 0, paddingTop: LH }}>
      <Row><S c={K.orange} b>  OpenCrabs Setup</S></Row>
      <Row><S c={K.gray} b>{"  " + (complete ? "All steps done" : `Step ${cur} of ${FLOW.length}`)}</S></Row>
      <Row />
      {FLOW.map((label, i) => {
        const n = i + 1;
        const [node, nc, lc, bold] = n < cur ? ["●", K.green, K.gray, false] : n === cur ? ["◉", K.orange, K.orange, true] : ["○", K.dim, K.dim, false];
        return (
          <React.Fragment key={label}>
            <Row><S>  </S><S c={nc} b={bold}>{node}</S><S>  </S><S c={lc} b={bold}>{label}</S></Row>
            {n < FLOW.length && <Row><S>  </S><S c={n + 1 <= cur ? K.green : K.dim}>│</S></Row>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Keys: React.FC<{ keys: [string, string, string][] }> = ({ keys }) => (
  <div style={{ whiteSpace: "pre" }}>{keys.map(([k, v, c]) => <React.Fragment key={k}><S c={c} b>{`[${k}] `}</S><S c={K.text}>{v + "  "}</S></React.Fragment>)}</div>
);

// footer_key_spans: step 1 of a first run quits, Health Check takes only Enter, the rest add Tab.
const footerKeys = (id: string, dt: number): [string, string, string][] => {
  if (id === "wiz-mode") return [["Esc", "Quit", K.red], ["Enter", "Confirm", K.orange]];
  if (id === "wiz-health") return [["Esc", "Back", K.red], ["Enter", dt >= 0.45 * CHECKS.length ? "Re-check" : "Check", K.orange]];
  return [["Esc", "Back", K.red], ["Tab", "Next Field", K.gray], ["Enter", "Confirm", K.orange]];
};

export const Wizard: React.FC<{ id: string; dt: number; os: WizardOS }> = ({ id, dt, os }) => {
  const base: React.CSSProperties = { position: "absolute", inset: 0, background: K.bg, fontFamily: MONO, fontSize: FS, lineHeight: `${LH}px`, color: K.text, display: "flex", flexDirection: "column" };
  if (id === "chat") return <Chat dt={dt} />;
  const done = id === "wiz-done";
  const st = STEPS[id];
  return (
    <div style={base}>
      <Band edge="top">
        {done ? <Row><S c={K.orange} b>OpenCrabs Setup Complete</S></Row> : (<>
          <Row><S c={K.orange} b>{st.title}</S></Row>
          <Row />
          <Row><S c={K.gray}>{st.sub}</S></Row>
        </>)}
      </Band>
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <Timeline cur={STEP_NO[id] ?? 1} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 81 * CW }}>
            {done ? (<>
              <Row /><Row /><Row /><Row><S c={K.orange} b>Setup complete!</S></Row><Row />
              <Row><S c={K.gray}>  Provider: </S><S b>z.ai</S></Row>
              <Row><S c={K.gray}>  Model:    </S><S b>{MODELS[0]}</S></Row>
              <Row><S c={K.gray}>  Workspace:</S><S>{" " + os.home}</S></Row>
              <Row /><Row /><Row><S c={K.orange} b><i>Entering OpenCrabs...</i></S></Row>
            </>) : (<>
              {id === "wiz-mode" && (<>
                <Row />
                {BANNER.map((b, i) => <Row key={i}><S c={K.orange} b>{b}</S></Row>)}
                <Row />
                <Row><S c={K.orange}><i>{"  🦀 The autonomous AI agent. Self-improving. Every channel."}</i></S></Row>
              </>)}
              <Row />
              <Body id={id} dt={dt} os={os} />
            </>)}
          </div>
        </div>
      </div>
      {!done && <Band edge="bottom"><Keys keys={footerKeys(id, dt)} /></Band>}
    </div>
  );
};

// First chat: the crab opens on its own after first-time setup (hidden WELCOME_MESSAGE in the real app).
// Example text only, labelled on screen: every crab opens differently.
const REPLY = "Fresh crab, fresh machine. I already looked around: z.ai is wired, brain files are seeded, nothing's broken. Want daily check-ins, task reminders, or a heartbeat? I can set them up right now.";
const Chat: React.FC<{ dt: number }> = ({ dt }) => {
  const replyN = Math.max(0, Math.floor((dt - 0.5) * 60));
  return (
    <div style={{ position: "absolute", inset: 0, background: K.bg, fontFamily: MONO, fontSize: 24, lineHeight: "34px", color: K.text, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 28px", borderBottom: `2px solid ${K.dim}`, display: "flex", justifyContent: "space-between" }}>
        <S c={K.orange} b>🦀 OpenCrabs</S><S c={K.gray}>zai · {MODELS[0]}</S>
      </div>
      <div style={{ flex: 1, padding: "26px 34px", display: "flex", flexDirection: "column", gap: 22, justifyContent: "flex-end" }}>
        {replyN > 0 && (
          <div style={{ whiteSpace: "pre-wrap" }}>
            <S c={K.orange} b>🦀  </S><S>{REPLY.slice(0, replyN)}</S>
            <div style={{ marginTop: 8, fontSize: 18, color: K.gold }}>example opening · yours will differ</div>
          </div>
        )}
      </div>
      <div style={{ borderTop: `2px solid ${K.dim}`, padding: "16px 28px" }}>
        <S c={K.orange}>❯ </S><S c={K.gold}>█</S>
      </div>
    </div>
  );
};
