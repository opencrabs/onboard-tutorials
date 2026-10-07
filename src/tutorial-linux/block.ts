// The docs' one-paste Linux amd64 block, line by line, and the passwordless sudo line, from the timeline (episode.mjs).
import TL from "./timeline.json";

export const BLOCK_LINES: string[] = TL.block.split("\n");
export const CMD_SUDO: string = TL.sudo;
