// L2 "Install OpenCrabs on macOS": the single source for VO, commands, scripted output and screens.
// Install is the docs' Option 1 (installation.md#option-1-homebrew). Apple Silicon, macOS 15+: the Homebrew bottles that exist.
// brew output is shortened from `brew install --dry-run opencrabs` and the formula's bottle list (opencrabs 0.5.4, rtk 0.50.0, opus 1.6.1);
// opencrabs itself never ran. scripts/engine/build_timeline.mjs tutorial-macos turns this into absolute times.

export const PROMPT = "you@MacBook ~ % ";

export const CMD = {
  brew: "brew install opencrabs",
  run: "opencrabs",
  homebrew: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
  update: "/evolve",
};

// Same beat format as tutorial-linux/episode.mjs.
export const CHAPTERS = [
  {
    n: 0, title: "Intro", copy: null,
    beats: [
      { vo: { id: "m0a", say: "That's OpenCrabs answering on a Mac. Here's how you get there, with one Homebrew command." } },
      { vo: { id: "m0b", say: "Open Terminal. Press Command and Space, type Terminal, and press Enter." }, act: [{ wait: 3.0 }, { prompt: true }] },
    ],
  },
  {
    n: 1, title: "Install with Homebrew", copy: CMD.brew,
    beats: [
      { vo: { id: "m1a", say: "Type brew install opencrabs, and press Enter. Homebrew downloads the ready-made build for Apple Silicon, plus two small helpers." },
        act: [{ wait: 0.3 }, { cmd: CMD.brew }, { out: [
          "==> Fetching downloads for: opencrabs",
          "@✔︎ Bottle opus (1.6.1)",
          "@✔︎ Bottle rtk (0.50.0)",
          "@✔︎ Bottle opencrabs (0.5.4)",
          "==> Installing dependencies for opencrabs: opus and rtk",
          "~[... output shortened ...]",
          "==> Pouring opencrabs--0.5.4.arm64_tahoe.bottle.tar.gz",
          "🍺  /opt/homebrew/Cellar/opencrabs/0.5.4",
        ], gap: 0.3 }, { zoom: "Cellar/opencrabs", note: "installed", dur: 3.0 }] },
      { vo: { id: "m1b", say: "If Terminal says command not found, brew, you don't have Homebrew yet. Install it from brew dot s h, the command is in the description, then run this line again.",
              sub: "If Terminal says \"command not found: brew\", you don't have Homebrew yet. Install it from brew.sh (the command is in the description), then run this line again." },
        act: [{ card: "fail-brew", dur: "beat" }] },
    ],
  },
  {
    n: 2, title: "The setup wizard", copy: CMD.run,
    beats: [
      { vo: { id: "m2a", say: "Now type opencrabs and press Enter. The setup wizard opens. It's the same wizard as in the Linux video, so here's the fast version." },
        act: [{ cmd: CMD.run }, { wait: 0.6 }, { screen: "wiz-mode", dur: 0.1 }] },
      { vo: { id: "m2b", say: "QuickStart. Keep the dot opencrabs folder with Seed template files ticked, that's your crab's personality.",
              sub: "QuickStart. Keep the .opencrabs folder with Seed template files ticked: that's your crab's personality." },
        act: [{ screen: "wiz-home", dur: 0.1 }] },
      { vo: { id: "m2c", say: "For Brain Fuel we use Z dot A I with GLM. On a coding plan, pick Coding API, then paste your key. It stays hidden.",
              sub: "For Brain Fuel we use z.ai with GLM. On a coding plan, pick Coding API, then paste your key. It stays hidden." },
        act: [{ screen: "wiz-provider", dur: 2.4 }, { screen: "wiz-key", dur: 0.1 }, { wait: 2.6 }, { card: "key", dur: 3.2 }] },
      { vo: { id: "m2d", say: "Keep the default model. Skip Always On and Make It Yours for now. Every check passes, and you're in." },
        act: [{ screen: "wiz-model", dur: 1.6 }, { screen: "wiz-daemon", dur: 1.6 }, { screen: "wiz-health", dur: 2.2 }, { screen: "wiz-brain", dur: 1.0 }, { screen: "wiz-done", dur: 1.4 }, { screen: "chat", dur: 0.1 }] },
      { vo: { id: "m2e", say: "Say hi. It answers. Yours will be different, but OpenCrabs is installed and running." }, act: [{ wait: 3.6 }] },
      { vo: { id: "m2f", say: "If macOS keeps asking whether Terminal can access data from other apps, give Terminal Full Disk Access once, in System Settings, Privacy and Security." },
        act: [{ card: "fda", dur: "beat" }] },
    ],
  },
  {
    n: 3, title: "What's next", copy: null,
    beats: [
      { vo: { id: "m3a", say: "From now on, just type opencrabs in any terminal. To update, type slash evolve inside OpenCrabs. It handles the rest.", sub: "From now on, just type opencrabs in any terminal. To update, type /evolve inside OpenCrabs. It handles the rest." }, act: [{ card: "next", dur: 999 }] },
      { vo: { id: "m3b", say: "Next up: connect Telegram, and chat with your crab from your phone. See you there." } },
    ],
  },
];

// code names the .srt; lead is the seconds before the first VO line (the payoff hook plays under it); description is the YouTube description.
const block = (s) => "```bash\n" + s + "\n```";
export const EPISODE = {
  code: "L2",
  lead: 0.5,
  extra: {},
  description: ({ chapterList }) => `# Install OpenCrabs on macOS

Chapters:
${chapterList}

For Apple Silicon Macs on macOS 15 or newer, where Homebrew has a ready-made build.

1. Install with Homebrew
${block(CMD.brew)}
No Homebrew yet? Install it first (from https://brew.sh):
${block(CMD.homebrew)}
2. Start it (the setup wizard opens on the first run)
${block(CMD.run)}
3. Update later: type \`/evolve\` inside OpenCrabs. On a Homebrew install it runs the brew upgrade for you.

Intel Mac or no Homebrew: download the macos release binary instead (docs, Option 2: Download Binary).

Troubleshooting:
- \`zsh: command not found: brew\`: Homebrew isn't installed. Install it with the line above, then run \`brew install opencrabs\` again.
- macOS keeps asking "would like to access data from other apps": System Settings → Privacy & Security → Full Disk Access → turn on Terminal.

Docs: https://docs.opencrabs.com/getting-started/installation.html
`,
};
