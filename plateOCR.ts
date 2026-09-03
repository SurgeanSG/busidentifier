import Tesseract from "tesseract.js";
import cv from "opencv4nodejs";
import { PlateResult } from "./types";

function cleanPlate(text: string): string | null {
    const cleaned = text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    /*
     * Singapore registration plates commonly contain
     * 1-3 letters, digits, then a final letter.
     *
     * This is intentionally permissive because OCR
     * can make mistakes. 
     *
     * This is for Singapore buses only.
     * If you want lets say London then change the pattern in lines 22-23.
     */

    const patterns = [
        /^[A-Z]{1,3}[0-9]{1,4}[A-Z]$/,
        /^[A-Z]{1,3}[0-9]{1,5}$/
    ];

    for (const pattern of patterns) {
        if (pattern.test(cleaned)) {
            return cleaned;
        }
    }

    return null;
}

export async function readPlate(
    image: cv.Mat
): Promise<PlateResult> {

    const gray = image.bgrToGray();

    const enlarged = gray.resize(
        gray.rows * 3,
        gray.cols * 3
    );

    const filtered = enlarged
        .gaussianBlur(new cv.Size(3, 3), 0)
        .threshold(0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

    const buffer = cv.imencode(".png", filtered);

    const result = await Tesseract.recognize(
        buffer,
        "eng",
        {
            logger: () => {}
        }
    );

    const plate = cleanPlate(result.data.text);

    return {
        plate,
        confidence: result.data.confidence
    };
}
