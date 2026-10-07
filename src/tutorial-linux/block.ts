// The docs' one-paste Linux amd64 block, line by line, and the passwordless sudo line, from the timeline (episode.mjs).
import { T } from "./state";

const TL = T as unknown as { block: string; sudo: string };
export const BLOCK_LINES: string[] = TL.block.split("\n");
export const CMD_SUDO: string = TL.sudo;
