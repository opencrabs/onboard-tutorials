// The docs' one-paste Linux amd64 block, line by line, from the timeline (episode.mjs BLOCK).
import { T } from "./state";

export const BLOCK_LINES: string[] = (T as unknown as { block: string }).block.split("\n");
