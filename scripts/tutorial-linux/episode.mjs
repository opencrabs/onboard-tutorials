// L1 "Install OpenCrabs on Ubuntu 24.04": the single source for VO, commands, scripted output and screens.
// Install is the docs' one-paste Linux amd64 block (opencrabs.com commits a781578 + 55fc17d).
// Output lines were captured from a clean ubuntu:24.04 amd64 container on 2026-10-06 (opencrabs itself never ran).
// scripts/engine/build_timeline.mjs tutorial-linux turns this into absolute times from the measured VO durations.

export const PROMPT = "you@ubuntu:~$ ";
const REL = "https://github.com/opencrabs/opencrabs/releases/download/${TAG}";

export const CMD = {
  sudo: 'echo "$USER ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/opencrabs && sudo chmod 440 /etc/sudoers.d/opencrabs',
  apt: "sudo apt update && sudo apt install -y curl jq libgomp1",
  tag: "TAG=$(curl -sL https://api.github.com/repos/opencrabs/opencrabs/releases/latest | jq -r .tag_name)",
  dl: `curl -fsSL "${REL}/opencrabs-\${TAG}-linux-amd64.tar.gz" | tar xz`,
  run: "./opencrabs",
};
// The docs' one-paste block (installation.md, Linux amd64), pasted as a whole.
export const BLOCK = [CMD.apt, CMD.tag, CMD.dl, CMD.run].join("\n");

// vo: id, say (sent to TTS), sub (on-screen text when it differs from say).
// act: sequential actions started with the beat (or after the VO when after: true).
//   cmd: type at the prompt and press Enter (paste: true lands it instantly). out: print lines. pw: silent sudo password.
//   dur: "beat" keeps a card up until the beat ends.
//   zoom: magnify the line containing `match`, non-blocking. card: overlay in the terminal, non-blocking.
//   screen: switch the terminal to a TUI screen (blocks for dur). wait: pause.
export const CHAPTERS = [
  {
    n: 0, title: "Intro", copy: null,
    beats: [
      { vo: { id: "c0a", say: "In this video, we'll install OpenCrabs on Ubuntu with a single paste, from zero to your first chat." },
        act: [{ card: "need", dur: 7.0 }] },
      { vo: { id: "c0c", say: "Open a terminal. On the Ubuntu desktop, press Control, Alt and T." }, act: [{ wait: 3.4 }, { prompt: true }] },
    ],
  },
  {
    n: 1, title: "No more password prompts", copy: CMD.sudo,
    beats: [
      { vo: { id: "s2a", say: "Next, one line so OpenCrabs never has to stop and ask for your password. Copy it from the description, paste it, and press Enter." },
        act: [{ card: "sudo", dur: "beat" }] },
      { vo: { id: "s2b", say: "Ubuntu asks for your password one last time. Nothing appears while you type it. That's normal. Type it and press Enter." },
        act: [{ wait: 0.3 }, { cmd: CMD.sudo, paste: true }, { pw: true }, { card: "pw", dur: 6.0 }, { wait: 0.4 }, { out: ["you ALL=(ALL) NOPASSWD:ALL"] }] },
      { vo: { id: "s2c", say: "Already logged in as root, on a server for example? Skip this line and paste the install block as it is." },
        act: [{ card: "root-skip", dur: "beat" }] },
    ],
  },
  {
    n: 2, title: "Paste the install block", copy: BLOCK,
    beats: [
      { vo: { id: "p2a", say: "Now the whole install is one paste. Copy this block from the docs or the description, paste it into the terminal, and press Enter." },
        act: [{ card: "block", dur: 9.5 }] },
      { vo: { id: "p2b", say: "On an ARM machine, copy the arm64 block from the docs instead. It's the same, with arm64 in the file name." },
        act: [{ card: "arm", dur: 8.5 }] },
      { vo: { id: "p2c", say: "This time there's no password prompt. It does everything in one go. It installs three small helpers, finds the newest release, downloads it, and starts OpenCrabs." },
        act: [{ wait: 0.3 }, { cmd: CMD.apt, paste: true }, { out: [
          "Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]",
          "Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]",
          "Fetched 33.2 MB in 3s (9973 kB/s)",
          "Reading package lists... Done",
          "~[... output shortened ...]",
          "Setting up libgomp1:amd64 (14.2.0-4ubuntu2~24.04.1) ...",
          "Setting up jq (1.7.1-3ubuntu0.24.04.2) ...",
          "Setting up curl (8.5.0-2ubuntu10.15) ...",
        ], gap: 0.22 }, { cmd: CMD.tag, paste: true }, { cmd: CMD.dl, paste: true }, { wait: 1.6 }] },
      { vo: { id: "f3a", say: "If you see gzip, unexpected end of file, here instead, the version lookup came back empty. Wait a moment, then paste the block again.",
              sub: "If you see gzip: unexpected end of file here instead, the version lookup came back empty. Wait a moment, then paste the block again." },
        act: [{ card: "fail-gzip", dur: "beat" }] },
      { vo: { id: "f3b", say: "If it stops at libgomp dot so dot one, cannot open shared object file, the helpers didn't install. Paste the block again.",
              sub: "If it stops at libgomp.so.1: cannot open shared object file, the helpers didn't install. Paste the block again." },
        act: [{ cmd: CMD.run, paste: true }, { card: "fail-gomp", dur: "beat" }] },
    ],
  },
  {
    n: 3, title: "The setup wizard", copy: null,
    beats: [
      { vo: { id: "c7b", say: "The setup wizard opens. Choose QuickStart, the sensible defaults, and press Enter." }, act: [{ screen: "wiz-mode", dur: 0.1 }] },
      { vo: { id: "c7c", say: "Home Base is the dot opencrabs folder in your home directory. That's always the default. Keep Seed template files ticked. We recommend it: those files give your crab its personality, so you start with the complete crab. You can change them later if you want. Press Enter." },
        act: [{ screen: "wiz-home", dur: 0.1 }] },
      { vo: { id: "c7d", say: "Brain Fuel is the important one. Pick your AI provider. We'll use Z dot A I with GLM models. It costs far less than most, and coding plans are supported.",
          sub: "Brain Fuel is the important one. Pick your AI provider. We'll use z.ai with GLM models. It costs far less than most, and coding plans are supported." },
        act: [{ screen: "wiz-provider", dur: 0.1 }] },
      { vo: { id: "c7e", say: "If you're on a GLM coding plan, set Endpoint Type to Coding API. Then paste your API key. It's hidden on screen. Never share your key with anyone." },
        act: [{ screen: "wiz-key", dur: 0.1 }, { wait: 3.8 }, { card: "key", dur: 7 }] },
      { vo: { id: "c7f", say: "Keep the default model, or pick another one, and press Enter." },
        act: [{ screen: "wiz-model", dur: 0.1 }] },
      { vo: { id: "c7g", say: "Always On can keep OpenCrabs running in the background. Skip it for now. There's a separate video for that." },
        act: [{ screen: "wiz-daemon", dur: 0.1 }] },
      { vo: { id: "c7h", say: "Vibe Check makes sure everything is wired up. All OK? Press Enter." },
        act: [{ screen: "wiz-health", dur: 0.1 }] },
      { vo: { id: "c7i", say: "Make It Yours lets you tell OpenCrabs about yourself. Press Escape to skip it for now." },
        act: [{ screen: "wiz-brain", dur: 0.1 }] },
      { vo: { id: "c7j", say: "Setup complete. And you're in. Say hi." },
        act: [{ screen: "wiz-done", dur: 2.6 }, { screen: "chat", dur: 0.1 }] },
      { vo: { id: "c7k", say: "It answers. Your reply will be different, but that's it. OpenCrabs is installed and running." },
        act: [{ wait: 3.5 }] },
      { vo: { id: "p3a", say: "Next time, start it the same way. Open a terminal in your home folder, and type dot slash opencrabs, then press Enter.", sub: "Next time, start it the same way. Open a terminal in your home folder, type ./opencrabs and press Enter." },
        act: [{ card: "again", dur: 999 }] },
    ],
  },
  {
    n: 4, title: "What's next", copy: null,
    beats: [
      { vo: { id: "c9a", say: "Every command from this video is in the description, ready to copy." }, act: [{ card: "next", dur: 999 }] },
      { vo: { id: "c9b", say: "Next up: keep OpenCrabs running in the background, and connect it to Telegram so you can chat from your phone. See you there." } },
    ],
  },
];

export const CHECKLIST = CHAPTERS.map((c) => c.title);

// code names the .srt; extra lands in timeline.json for the cards; description is the YouTube description.
const block = (s) => "```bash\n" + s + "\n```";
export const EPISODE = {
  code: "L1",
  extra: { block: BLOCK, sudo: CMD.sudo },
  description: ({ chapterList }) => `# Install OpenCrabs on Ubuntu 24.04+

Chapters:
${chapterList}

Needs Ubuntu 24.04 or newer (glibc 2.39+), 64-bit.

1. Skip password prompts (recommended; skip it if you are already root)
${block(CMD.sudo)}
2. Paste the install block (Linux amd64)
${block(BLOCK)}
ARM (arm64): use the same block with amd64 replaced by arm64, or copy "Linux (arm64)" from the docs.
3. Next time, start it from your home folder
${block(CMD.run)}

Troubleshooting:
- \`gzip: unexpected end of file\`: the version lookup came back empty. Wait a moment, then paste the block again.
- \`libgomp.so.1: cannot open shared object file\`: the helpers did not install. Paste the block again.

Docs: https://docs.opencrabs.com/getting-started/installation.html
`,
};
