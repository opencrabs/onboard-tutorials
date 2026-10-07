// Which episodes' docs sections changed since the docs commit they were scripted against:
//   DOCS_REPO=<local clone of the docs repo> node scripts/engine/stale.mjs [ref]   (ref defaults to origin/main)
// Compares only the mapped section (the heading whose mdBook anchor matches, up to the next heading of the same or higher level).
// Exit 1 when any episode is stale or its pinned commit isn't on the ref yet, so CI or a release check can gate on it.
import fs from "node:fs";
import os from "node:os";
import { execFileSync } from "node:child_process";

const REPO = process.env.DOCS_REPO ?? `${os.homedir()}/srv/rs/crabsland`;
const REF = process.argv[2] ?? "origin/main";
const git = (...a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const { videos } = JSON.parse(fs.readFileSync(new URL("../../videos.json", import.meta.url)));

// mdBook heading ids: lowercase, punctuation dropped, spaces to dashes.
const slug = (h) => h.trim().toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, "").replace(/ /g, "-");
const section = (md, anchor) => {
  const lines = md.split("\n");
  let inCode = false, start = -1, level = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("```")) inCode = !inCode;
    const m = !inCode && lines[i].match(/^(#+)\s+(.*)$/);
    if (!m) continue;
    if (start >= 0 && m[1].length <= level) return lines.slice(start, i).join("\n");
    if (start < 0 && slug(m[2]) === anchor) { start = i; level = m[1].length; }
  }
  return start < 0 ? null : lines.slice(start).join("\n");
};
const show = (rev, path) => { try { return git("show", `${rev}:${path}`); } catch { return null; } };

let bad = 0;
for (const v of videos) {
  let state;
  try { git("cat-file", "-e", `${v.pinned_sha}^{commit}`); } catch { state = "UNKNOWN PIN (not in the local docs clone)"; }
  if (!state) {
    const onRef = (() => { try { git("merge-base", "--is-ancestor", v.pinned_sha, REF); return true; } catch { return false; } })();
    const was = section(show(v.pinned_sha, v.source) ?? "", v.anchor);
    const now = section(show(REF, v.source) ?? "", v.anchor);
    if (was === null) state = `BAD ANCHOR (#${v.anchor} not in ${v.source} at ${v.pinned_sha})`;
    else if (!onRef) state = `UNPUBLISHED (pin ${v.pinned_sha} is not on ${REF}: the docs the video teaches aren't live yet)`;
    else if (now === null) state = `STALE (section #${v.anchor} gone on ${REF})`;
    else if (was !== now) state = `STALE (section changed on ${REF}: git -C ${REPO} diff ${v.pinned_sha} ${REF} -- ${v.source})`;
    else state = "ok";
  }
  if (state !== "ok") bad++;
  console.log(`${v.id.padEnd(4)} ${v.source}#${v.anchor}  ${state}`);
}
process.exit(bad ? 1 : 0);
