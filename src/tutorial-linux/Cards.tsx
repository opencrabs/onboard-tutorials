// L1 overlay card bodies (need, fail-*, sudo, root-skip, block, arm, pw, key, again, next), drawn in the engine's Card.
import React from "react";
import { Fail, H, Item, Key, Mono, O } from "../engine/Card";
import { C, MONO, SANS } from "../theme";
import { BLOCK_LINES, CMD_SUDO } from "./block";

export const Body: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "need":
      return (<>
        <H>What you need</H>
        <Item icon="🐧">Ubuntu <b>24.04 or newer</b>, 64-bit</Item>
        <Item icon="🌐">An internet connection</Item>
        <Item icon="🔑">A key or subscription from an AI provider</Item>
        <Item icon="⏱" c={C.dim}>About 2 minutes, one paste</Item>
      </>);
    case "fail-gzip":
      return <Fail err="gzip: unexpected end of file" why="The version lookup came back empty" fix="Wait a moment, then paste the block again" />;
    case "fail-gomp":
      return <Fail err="libgomp.so.1: cannot open shared object file" why="The helpers didn't install" fix="Paste the block again" />;
    case "sudo":
      return (<>
        <H>One line, no more password prompts</H>
        <Mono>{CMD_SUDO}</Mono>
        <Item icon="🔓">Lets OpenCrabs use sudo without stopping to ask</Item>
        <Item icon="📋" c={C.dim}>Recommended · also in the description</Item>
      </>);
    case "root-skip":
      return (<>
        <H>Already root?</H>
        <Item icon="#">Prompt ends in <span style={{ fontFamily: MONO, color: O }}>#</span>, like on a fresh server</Item>
        <Item icon="⏭">Skip this line, paste the install block as it is</Item>
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
