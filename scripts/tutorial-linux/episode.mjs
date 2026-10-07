// L1 "Install OpenCrabs on Ubuntu 24.04": the single source for VO, commands, scripted output and screens.
// Install is the docs' one-paste Linux amd64 block (opencrabs.com commits a781578 + 55fc17d).
// Output lines were captured from a clean ubuntu:24.04 amd64 container on 2026-10-06 (opencrabs itself never ran).
// build_timeline.mjs turns this into absolute times from the measured VO durations.

export const PROMPT = "you@ubuntu:~$ ";
const REL = "https://github.com/opencrabs/opencrabs/releases/download/${TAG}";

export const CMD = {
  ldd: "ldd --version",
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
//   zoom: magnify the line containing `match`, non-blocking. card: overlay in the terminal, non-blocking.
//   screen: switch the terminal to a TUI screen (blocks for dur). wait: pause.
export const CHAPTERS = [
  {
    n: 0, title: "Intro", copy: null,
    beats: [
      { vo: { id: "c0a", say: "In this video, we'll install OpenCrabs on Ubuntu with a single paste, from zero to your first chat." },
        act: [{ card: "need", dur: 12.5 }] },
      { vo: { id: "c0b", say: "You need Ubuntu 24.04 or newer on a 64-bit machine, an internet connection, and a key or subscription from an AI provider." } },
      { vo: { id: "c0c", say: "Open a terminal. On the Ubuntu desktop, press Control, Alt and T." }, act: [{ wait: 3.4 }, { prompt: true }] },
    ],
  },
  {
    n: 1, title: "Check your system",
    beats: [
      { vo: { id: "c1c", say: "First, one quick check. Your glibc version must be 2.39 or newer." },
        act: [{ wait: 0.4 }, { cmd: CMD.ldd }, { out: [
          "ldd (Ubuntu GLIBC 2.39-0ubuntu8.9) 2.39",
          "Copyright (C) 2024 Free Software Foundation, Inc.",
          "This is free software; see the source for copying conditions.  There is NO",
          "warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.",
          "Written by Roland McGrath and Ulrich Drepper.",
        ] }, { zoom: "GLIBC 2.39", dur: 7.5, note: "2.39 or newer: good" }] },
      { vo: { id: "c1d", say: "Here it says 2.39, so we're good. Older than that? This download won't run there, so watch the older systems video instead." } },
    ],
  },
  {
    n: 2, title: "Paste the install block", copy: BLOCK,
    beats: [
      { vo: { id: "p2a", say: "Now the whole install is one paste. Copy this block from the docs or the description, paste it into the terminal, and press Enter." },
        act: [{ card: "block", dur: 9.5 }] },
      { vo: { id: "p2b", say: "On an ARM machine, copy the arm64 block from the docs instead. It's the same, with arm64 in the file name." },
        act: [{ card: "arm", dur: 8.5 }] },
      { vo: { id: "c2b", say: "Ubuntu asks for your password. Nothing appears while you type it. That's normal. Type it and press Enter." },
        act: [{ wait: 0.3 }, { cmd: CMD.apt, paste: true }, { pw: true }, { card: "pw", dur: 6.5 }] },
      { vo: { id: "p2c", say: "Then it does everything in one go. It installs three small helpers, finds the newest release, downloads it, and starts OpenCrabs." },
        act: [{ out: [
          "Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]",
          "Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]",
          "Fetched 33.2 MB in 3s (9973 kB/s)",
          "Reading package lists... Done",
          "~[... output shortened ...]",
          "Setting up libgomp1:amd64 (14.2.0-4ubuntu2~24.04.1) ...",
          "Setting up jq (1.7.1-3ubuntu0.24.04.2) ...",
          "Setting up curl (8.5.0-2ubuntu10.15) ...",
        ], gap: 0.22 }, { cmd: CMD.tag, paste: true }, { cmd: CMD.dl, paste: true }, { wait: 1.6 }, { cmd: CMD.run, paste: true }, { wait: 1.2 }] },
    ],
  },
  {
    n: 3, title: "The setup wizard", copy: null,
    beats: [
      { vo: { id: "c7b", say: "The setup wizard opens. Choose QuickStart, the sensible defaults, and press Enter." }, act: [{ screen: "wiz-mode", dur: 0.1 }] },
      { vo: { id: "c7c", say: "Home Base is the dot opencrabs folder in your home directory. That's always the default. Keep Seed template files ticked. We recommend it: those files give your crab its personality, so you start with the complete crab. You can change them later if you want. Press Enter." },
        act: [{ screen: "wiz-home", dur: 0.1 }] },
      { vo: { id: "c7d", say: "Brain Fuel is the important one. Pick your AI provider. We'll choose Anthropic." },
        act: [{ screen: "wiz-provider", dur: 0.1 }] },
      { vo: { id: "c7e", say: "Now paste your API key, or a setup token if you have a Claude subscription. It's hidden on screen. Never share your key with anyone." },
        act: [{ screen: "wiz-key", dur: 0.1 }, { card: "key", dur: 9.5 }] },
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
    n: 4, title: "If something breaks", copy: CMD.ldd,
    beats: [
      { vo: { id: "c8a", say: "If something goes wrong, here are the three errors people hit most, and the fix for each." },
        act: [{ card: "errors", dur: 999 }] },
      { vo: { id: "c8b", say: "GLIBC 2.39 not found means your system is too old for this download. Watch the older systems video instead.", sub: "GLIBC_2.39 not found means your system is too old for this download. Watch the older systems video instead." }, copy: CMD.ldd },
      { vo: { id: "p4c", say: "libgomp.so.1, cannot open shared object file, means the helpers are missing. Paste the install block again.", sub: "libgomp.so.1: cannot open shared object file means the helpers are missing. Paste the install block again." }, copy: BLOCK },
      { vo: { id: "p4d", say: "gzip, unexpected end of file, means the version lookup came back empty. Wait a moment, then paste the block again.", sub: "gzip: unexpected end of file means the version lookup came back empty. Wait a moment, then paste the block again." }, copy: BLOCK },
    ],
  },
  {
    n: 5, title: "What's next", copy: null,
    beats: [
      { vo: { id: "c9a", say: "Every command from this video is in the description, ready to copy." }, act: [{ card: "next", dur: 999 }] },
      { vo: { id: "c9b", say: "Next up: keep OpenCrabs running in the background, and connect it to Telegram so you can chat from your phone. See you there." } },
    ],
  },
];

export const CHECKLIST = CHAPTERS.map((c) => c.title);
