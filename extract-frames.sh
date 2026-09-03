#!/usr/bin/env bash
set -euo pipefail
VIDEO="${1:?usage: ./scripts/extract-frames.sh video.mp4 [outdir] [fps]}"
OUT="${2:-frames}"
FPS="${3:-5}"
mkdir -p "$OUT"
ffmpeg -i "$VIDEO" -vf "fps=$FPS" "$OUT/frame_%06d.jpg"
