#!/bin/bash
# Trims dead air off each raw TTS line (public/audio/raw/tutorial-linux) into public/audio/tutorial-linux.
# Optional TEMPO env scales every line (1.0 keeps the TTS pace).
set -euo pipefail
cd "$(dirname "$0")/../.."
TEMPO=${TEMPO:-1.0}
node -e 'for (const l of require(process.argv[1])) console.log(l.id)' "$PWD/scripts/tutorial-linux/vo_lines.json" |
while read -r id; do
  trim="silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15,areverse"
  ffmpeg -y -v error -i "public/audio/raw/tutorial-linux/vo_$id.wav" -af "$trim,atempo=$TEMPO" -ar 44100 -ac 1 "public/audio/tutorial-linux/vo_$id.wav"
  printf '%s %s\n' "$id" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "public/audio/tutorial-linux/vo_$id.wav")"
done
