#!/bin/bash
# VO lines placed at their anchors, bed ducked under the voice, loudness to -14 LUFS.
set -euo pipefail
cd "$(dirname "$0")/.."
LINES=${1:-scripts/vo_lines.json}; DIR=${2:-public/audio}; DUR=${3:-60}
inputs=(); filters=""; labels=""; i=1
while read -r id at file; do
  inputs+=(-i "${file:-$DIR/vo_$id.wav}")
  ms=$(node -e "console.log(Math.round($at*1000))")
  filters+="[$i:a]aresample=44100,aformat=channel_layouts=stereo,adelay=${ms}|${ms}[v$i];"
  labels+="[v$i]"; i=$((i+1))
done < <(node -e 'for (const l of require(process.argv[1])) console.log(l.id, l.at, l.file ?? "")' "$PWD/$LINES")
n=$((i-1))
ffmpeg -y -v error -i "$DIR/bed.wav" "${inputs[@]}" -filter_complex \
"${filters}${labels}amix=inputs=$n:normalize=0,apad=whole_dur=$DUR,highpass=f=80,acompressor=threshold=0.1:ratio=3:attack=5:release=120:makeup=2[vo];[vo]asplit[vo1][vo2];\
[0:a]volume=0.3[bed];[bed][vo1]sidechaincompress=threshold=0.015:ratio=10:attack=10:release=400[ducked];\
[ducked][vo2]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,atrim=0:$DUR[out]" \
-map "[out]" -ar 44100 "$DIR/mix.wav"
ffmpeg -hide_banner -i "$DIR/mix.wav" -af ebur128=peak=true -f null - 2>&1 | grep -E 'I:|Peak:' | tail -2
