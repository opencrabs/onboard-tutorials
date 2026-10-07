// L2 overlay card bodies (fail-brew, key, fda, next), drawn in the engine's Card.
import React from "react";
import { Fail, H, Item, Mono, O } from "../engine/Card";
import { C, MONO } from "../theme";

export const Body: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "fail-brew":
      return <Fail err="zsh: command not found: brew" why="Homebrew isn't installed yet" fix="Install it from brew.sh (command in the description), then run brew install opencrabs again" />;
    case "key":
      return (<>
        <H>Your key stays hidden</H>
        <Item icon="🔒">It shows as <span style={{ fontFamily: MONO, color: "#e0a84a" }}>**********</span> while you paste</Item>
        <Item icon="🎬" c={C.dim}>No real key appears anywhere in this video</Item>
      </>);
    case "fda":
      return (<>
        <H>macOS keeps asking for access?</H>
        <Item icon="⚙">System Settings → Privacy &amp; Security → <b>Full Disk Access</b></Item>
        <Item icon="✓" c={C.green}>Turn on <b>Terminal</b>. Once, and the prompts stop.</Item>
      </>);
    case "next":
      return (<>
        <H>You're installed 🦀</H>
        <Item icon="⌨">Start it any time:</Item>
        <Mono c={C.green}>opencrabs</Mono>
        <div style={{ height: 20 }} />
        <Item icon="⬆">Update: <span style={{ fontFamily: MONO, color: O }}>brew upgrade opencrabs</span></Item>
        <Item icon="→" c={O}><b>Next:</b> connect Telegram and chat from your phone</Item>
      </>);
    default:
      return null;
  }
};
