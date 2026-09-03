import cv from "opencv4nodejs";
import { BusDetection } from "./types";

/*
 * This class is the interface between the rest of the
 * application and your YOLO bus detector.
 *
 * Replace detect() with inference from the YOLO model
 * you train/download.
 */

export class BusDetector {

    async detect(frame: cv.Mat): Promise<BusDetection[]> {

        /*
         * TODO:
         *
         * 1. Convert frame to model input
         * 2. Run YOLO
         * 3. Keep detections whose class is "bus"
         * 4. Apply confidence threshold
         * 5. Return bounding boxes
         */

        return [];
    }
}
