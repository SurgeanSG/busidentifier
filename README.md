# Bus Identifier (TypeScript)

A TypeScript/Node.js pipeline that:

1. detects buses with a YOLO ONNX model;
2. detects a licence plate inside each bus crop with a second YOLO ONNX model;
3. OCRs the plate using Tesseract.js;
4. looks up the registration in `data/fleet.json`;
5. logs results to CSV and JSONL.

## Requirements

- Node.js 20+
- npm
- Two ONNX detector models (see `models/README.md`)
- Optional: FFmpeg if you want to turn videos into image frames

## Install

```bash
npm install
```

## Add models

Place these files in `models/`:

```text
models/bus.onnx
models/plate.onnx
```

`bus.onnx` should be an Ultralytics-style YOLO detector. For a standard COCO model, the default bus class is ID 5. `plate.onnx` should be a one-class YOLO licence-plate detector.

## Add fleet data

Edit `data/fleet.json`:

```json
[
  {
    "registration": "SG1234A",
    "model": "Bus model here",
    "operator": "Operator here"
  }
]
```

Do not rely on guessed mappings: the model lookup is only as accurate as the fleet file you provide.

## Run on one image

```bash
npm start -- --input path/to/photo.jpg
```

## Run on a folder of frames

```bash
npm start -- --input frames
```

## Video

The detector works on image frames. Extract frames with FFmpeg first.

Windows PowerShell:

```powershell
./scripts/extract-frames.ps1 -Video bus-video.mp4 -OutDir frames -Fps 5
npm start -- --input frames
```

macOS/Linux:

```bash
./scripts/extract-frames.sh bus-video.mp4 frames 5
npm start -- --input frames
```

## Output

Results are appended to:

```text
output/detections.csv
output/detections.jsonl
```

Example CSV columns:

```text
source,frame,trackId,registration,ocrConfidence,model,operator
```

## Accuracy notes

Plate OCR is sensitive to blur, glare, distance, angle, and partial obstruction. A dedicated Singapore plate detector and good close-up footage will matter more than tweaks to OCR. Exact bus-model identification comes from the registration-to-model fleet database, not visual guessing.

## Type-check

```bash
npm run check
```

## Build

```bash
npm run build
```
