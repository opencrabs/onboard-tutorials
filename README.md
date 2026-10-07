# OpenCrabs onboarding tutorials

Step-by-step install and setup videos, one per docs page, rendered with Remotion. The terminal is drawn, not recorded.

## Adding an episode

Every episode runs on the shared engine (`src/engine`, `scripts/engine`), so a new one is:

1. `scripts/<episode>/episode.mjs`: chapters, beats (VO line + actions), and `EPISODE` (srt code, timeline extras, YouTube description).
2. `src/<episode>/`: a config for `<Episode>` (heading, terminal skin, wizard home path, title, card bodies, optional overlays) and its `Composition` in `src/Root.tsx`.

Then, with `<episode>` the folder name (e.g. `tutorial-linux`):

```bash
npm run vo-lines -- <episode>                                                      # vo_lines.json from episode.mjs
npm run vo -- scripts/<episode>/vo_lines.json public/audio/raw/<episode>            # TTS (configured OpenAI voice)
npm run fit -- <episode>                                                           # trim dead air
npm run timeline -- <episode>                                                      # timeline.json, .srt, chapters, description, mix.wav
npm run probe -- <CompositionId> out/<episode>/probe 0 300 900                     # stills to check before rendering
```

`scripts/stt.sh <file>` runs any line or the final mp4 back through the configured Groq whisper.

## Keeping videos in sync with the docs

`videos.json` maps each episode to the docs page section it teaches and the docs commit it was scripted against. `npm run stale` (with `DOCS_REPO` pointing at a local clone of the docs repo) compares that section at the pinned commit with `origin/main` and exits 1 when an episode is stale or its pinned docs aren't live yet. After re-scripting an episode, move its `pinned_sha` to the docs commit it now matches.
