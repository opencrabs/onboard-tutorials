// L1 "Install OpenCrabs on Ubuntu 24.04": the single source for VO, commands, scripted output and screens.
// Commands follow the corrected install docs (opencrabs.com commit a781578) plus the agreed apt line.
// Output lines were captured from a clean ubuntu:24.04 amd64 container on 2026-10-06 (opencrabs itself never ran).
// build_timeline.mjs turns this into absolute times from the measured VO durations.

export const PROMPT = "you@ubuntu:~$ ";
const REL = "https://github.com/opencrabs/opencrabs/releases/download/${TAG}";

export const CMD = {
  uname: "uname -m",
  ldd: "ldd --version",
  apt: "sudo apt update && sudo apt install -y curl jq libgomp1",
  tag: "TAG=$(curl -sL https://api.github.com/repos/opencrabs/opencrabs/releases/latest | jq -r .tag_name)",
  echo: "echo $TAG",
  dl: `curl -fsSL "${REL}/opencrabs-\${TAG}-linux-amd64.tar.gz" | tar xz`,
  dlArm: `curl -fsSL "${REL}/opencrabs-\${TAG}-linux-arm64.tar.gz" | tar xz`,
  ls: "ls",
  getTgz: `curl -fsSLO "${REL}/opencrabs-\${TAG}-linux-amd64.tar.gz"`,
  getSums: `curl -fsSLO "${REL}/SHA256SUMS"`,
  check: "sha256sum --check --ignore-missing SHA256SUMS",
  untar: 'tar xzf "opencrabs-${TAG}-linux-amd64.tar.gz"',
  mv: "mkdir -p ~/.local/bin && mv opencrabs rtk ~/.local/bin/",
  ver: "opencrabs --version",
  path: 'export PATH="$HOME/.local/bin:$PATH"',
  run: "opencrabs",
};

// vo: id, say (sent to TTS), sub (on-screen text when it differs from say).
// act: sequential actions started with the beat (or after the VO when after: true).
//   cmd: type at the prompt and press Enter. out: print lines. pw: silent sudo password.
//   zoom: magnify the line containing `match`, non-blocking. card: overlay in the terminal, non-blocking.
//   screen: switch the terminal to a TUI screen (blocks for dur). wait: pause.
export const CHAPTERS = [
  {
    n: 0, title: "Intro", copy: null,
    beats: [
      { vo: { id: "c0a", say: "In this video, we'll install OpenCrabs on Ubuntu, from zero to your first chat. It takes about five minutes." },
        act: [{ card: "need", dur: 13.5 }] },
      { vo: { id: "c0b", say: "You need Ubuntu 24.04 or newer on a 64-bit machine, an internet connection, and a key or subscription from an AI provider." } },
      { vo: { id: "c0c", say: "Open a terminal. On the Ubuntu desktop, press Control, Alt and T." }, act: [{ wait: 3.4 }, { prompt: true }] },
    ],
  },
  {
    n: 1, title: "Check your system",
    beats: [
      { vo: { id: "c1a", say: "First, two quick checks. Your CPU type decides which file you download." },
        act: [{ wait: 0.6 }, { cmd: CMD.uname }, { out: ["x86_64"] }, { zoom: "x86_64", dur: 6.5, note: "x86_64 = amd64 file" }] },
      { vo: { id: "c1b", say: "x86_64 means you want the amd64 download. On an ARM machine you'll see aarch64 instead, and you want arm64.",
               sub: "x86_64 means you want the amd64 download. On an ARM machine you'll see aarch64 instead, and you want arm64." } },
      { vo: { id: "c1c", say: "Next, your glibc version. It must be 2.39 or newer." },
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
    n: 2, title: "Helpers",
    beats: [
      { vo: { id: "c2a", say: "Now install three small helpers. curl downloads files, jq reads the release info, and libgomp is a library OpenCrabs needs to run." },
        act: [{ wait: 0.5 }, { cmd: CMD.apt }, { pw: true }] },
      { vo: { id: "c2b", say: "Ubuntu asks for your password. Nothing appears while you type it. That's normal. Type it and press Enter." },
        act: [{ card: "pw", dur: 7 }] },
      { vo: { id: "c2c", say: "Ubuntu fetches the package lists, then installs the helpers." },
        act: [{ out: [
          "Get:1 http://archive.ubuntu.com/ubuntu noble InRelease [256 kB]",
          "Get:2 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]",
          "Get:3 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]",
          "Get:4 http://archive.ubuntu.com/ubuntu noble-backports InRelease [126 kB]",
          "Fetched 33.2 MB in 3s (9973 kB/s)",
          "Reading package lists... Done",
          "Building dependency tree... Done",
          "Reading state information... Done",
          "Reading package lists... Done",
          "Building dependency tree... Done",
          "Reading state information... Done",
          "~[... output shortened ...]",
          "Setting up libgomp1:amd64 (14.2.0-4ubuntu2~24.04.1) ...",
          "Setting up jq (1.7.1-3ubuntu0.24.04.2) ...",
          "Setting up curl (8.5.0-2ubuntu10.15) ...",
          "Processing triggers for libc-bin (2.39-0ubuntu8.9) ...",
        ], gap: 0.22 }, { prompt: true }] },
      { vo: { id: "c2d", say: "When you're back at the prompt, the helpers are ready." } },
    ],
  },
  {
    n: 3, title: "Find the latest version",
    beats: [
      { vo: { id: "c3a", say: "Next, ask GitHub for the newest release, and keep its version number in a variable called TAG." },
        act: [{ wait: 0.4 }, { cmd: CMD.tag }, { prompt: true }] },
      { vo: { id: "c3b", say: "Print it to check. If you see a version number, like v0.5.4, you're good.", sub: "Print it to check. If you see a version number, like v0.5.4, you're good." },
        act: [{ wait: 0.2 }, { cmd: CMD.echo }, { out: ["v0.5.4"] }, { zoom: "v0.5.4", dur: 6, note: "latest tag" }] },
      { vo: { id: "c3c", say: "If the line comes back empty, just run the TAG command again before you move on." } },
    ],
  },
  {
    n: 4, title: "Download",
    beats: [
      { vo: { id: "c4a", say: "Now download and unpack it in one line. The TAG variable fills in the version for you." },
        act: [{ wait: 0.3 }, { cmd: CMD.dl }, { wait: 1.2 }, { prompt: true }] },
      { vo: { id: "c4b", say: "List the folder. You get two files: opencrabs itself, and rtk, a small helper it ships with." },
        act: [{ cmd: CMD.ls }, { out: ["@opencrabs  rtk"] }, { zoom: "opencrabs  rtk", dur: 5, note: "both files" }] },
      { vo: { id: "c4c", say: "On an ARM machine, the one that said aarch64, swap amd64 for arm64 in the file name." },
        act: [{ card: "arm", dur: 9 }], copy: CMD.dlArm },
    ],
  },
  {
    n: 5, title: "Verify checksum (optional)",
    beats: [
      { vo: { id: "c5a", say: "This step is optional, but it's a good habit. Download the archive and the published list of checksums." },
        act: [{ wait: 0.3 }, { cmd: CMD.getTgz }, { wait: 0.8 }, { prompt: true }, { cmd: CMD.getSums }, { prompt: true }] },
      { vo: { id: "c5b", say: "Then let sha256sum compare them. OK means your file is exactly what was released." },
        act: [{ cmd: CMD.check }, { out: ["opencrabs-v0.5.4-linux-amd64.tar.gz: OK"] }, { zoom: ": OK", dur: 5.5, note: "checksum matches" }] },
      { vo: { id: "c5c", say: "Unpack this checked copy, and you're set." },
        act: [{ wait: 0.2 }, { cmd: CMD.untar }, { prompt: true }] },
    ],
  },
  {
    n: 6, title: "Put it on your PATH",
    beats: [
      { vo: { id: "c6a", say: "Now move both files into a folder on your path, so you can run OpenCrabs from anywhere. No sudo needed." },
        act: [{ wait: 0.3 }, { cmd: CMD.mv }, { prompt: true }] },
      { vo: { id: "c6b", say: "Check that it works." },
        act: [{ cmd: CMD.ver }, { out: ["opencrabs 0.5.4"] }, { zoom: "opencrabs 0.5.4", dur: 5, note: "installed" }] },
      { vo: { id: "c6c", say: "If your terminal says command not found, open a new terminal window and try again. Still not found? Run this export line, then try once more." },
        act: [{ card: "notfound", dur: 13 }], copy: CMD.path },
    ],
  },
  {
    n: 7, title: "First run and the setup wizard",
    beats: [
      { vo: { id: "c7a", say: "Time for the first run. Type opencrabs and press Enter." },
        act: [{ wait: 0.3 }, { cmd: CMD.run }, { wait: 0.4 }, { screen: "wiz-mode", dur: 0.1 }] },
      { vo: { id: "c7b", say: "The setup wizard opens. Choose QuickStart, the sensible defaults, and press Enter." }, act: [{ wait: 0.1 }] },
      { vo: { id: "c7c", say: "Home Base is where OpenCrabs keeps its files. The default is fine. Press Enter." },
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
    ],
  },
  {
    n: 8, title: "If something breaks", copy: CMD.ldd,
    beats: [
      { vo: { id: "c8a", say: "If something goes wrong, here are the three errors people hit most, and the fix for each." },
        act: [{ card: "errors", dur: 999 }] },
      { vo: { id: "c8b", say: "GLIBC 2.39 not found means your system is too old for this download. Watch the older systems video instead.", sub: "GLIBC_2.39 not found means your system is too old for this download. Watch the older systems video instead." }, copy: CMD.ldd },
      { vo: { id: "c8c", say: "libgomp.so.1, cannot open shared object file, means the helpers are missing. Go back to chapter two.", sub: "libgomp.so.1: cannot open shared object file means the helpers are missing. Go back to chapter 2." }, copy: CMD.apt },
      { vo: { id: "c8d", say: "gzip, unexpected end of file, means TAG was empty. Run chapter three again, then download again.", sub: "gzip: unexpected end of file means TAG was empty. Run chapter 3 again, then download again." }, copy: CMD.tag },
    ],
  },
  {
    n: 9, title: "What's next", copy: null,
    beats: [
      { vo: { id: "c9a", say: "Every command from this video is in the description, ready to copy." }, act: [{ card: "next", dur: 999 }] },
      { vo: { id: "c9b", say: "Next up: keep OpenCrabs running in the background, and connect it to Telegram so you can chat from your phone. See you there." } },
    ],
  },
];

export const CHECKLIST = CHAPTERS.map((c) => c.title);
