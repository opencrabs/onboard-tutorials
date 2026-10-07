#!/bin/bash
# Temp VO from the configured TTS provider ([providers.tts.openai] in config.toml: gpt-4o-mini-tts, voice echo).
# Swap public/audio/vo_*.wav for a real take.
set -euo pipefail
cd "$(dirname "$0")/.."
LINES=${1:-scripts/vo_lines.json}; OUT=${2:-public/audio}
K=$(python3 -c "import tomllib,os;print(tomllib.load(open(os.path.expanduser('~/.opencrabs/keys.toml'),'rb'))['providers']['tts']['openai']['api_key'])")
STYLE=${STYLE:-"Calm, warm, confident tech narrator. Conversational, unhurried, like telling a friend about a tool that saved your evening. Short dry pause at periods."}
node -e 'for (const l of require(process.argv[1])) if (l.text) console.log(l.id+"\t"+l.text)' "$PWD/$LINES" |
while IFS=$'\t' read -r id text; do
  body=$(python3 -c 'import json,sys;print(json.dumps({"model":"gpt-4o-mini-tts","voice":"echo","response_format":"wav","input":sys.argv[1],"instructions":sys.argv[2]}))' "$text" "$STYLE")
  code=$(curl -s -o "$OUT/vo_$id.wav" -w '%{http_code}' https://api.openai.com/v1/audio/speech \
    -H "Authorization: Bearer $K" -H "Content-Type: application/json" -d "$body")
  [ "$code" = 200 ] || { echo "vo_$id HTTP $code: $(head -c 300 $OUT/vo_$id.wav)"; exit 1; }
  printf '%s %s\n' "$id" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/vo_$id.wav")"
done
