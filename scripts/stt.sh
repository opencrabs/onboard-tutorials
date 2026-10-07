#!/bin/bash
# Transcribe an audio/video file with the configured STT provider ([providers.stt.groq], whisper-large-v3-turbo).
set -euo pipefail
K=$(python3 -c "import tomllib,os;print(tomllib.load(open(os.path.expanduser('~/.opencrabs/keys.toml'),'rb'))['providers']['stt']['groq']['api_key'])")
tmp=$(mktemp -t stt).mp3
ffmpeg -y -v error -i "$1" -vn -ac 1 -ar 16000 -b:a 48k "$tmp"
curl -s https://api.groq.com/openai/v1/audio/transcriptions -H "Authorization: Bearer $K" \
  -F model=whisper-large-v3-turbo -F response_format=text -F "file=@$tmp"
rm -f "$tmp"
