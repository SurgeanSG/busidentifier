import cv from "opencv4nodejs";
import { BusDetector } from "./detector";
import { readPlate } from "./plateOCR";
import { loadFleet, findBus } from "./busModel";

async function main() {

    console.log("🇸🇬 Singapore Bus Identifier");
    console.log("--------------------------------");

    loadFleet();

    const detector = new BusDetector();

    const camera = new cv.VideoCapture(0);

    while (true) {

        let frame = camera.read();

        if (frame.empty) {
            camera.reset();
            continue;
        }

        const buses = await detector.detect(frame);

        for (const bus of buses) {

            const x = Math.max(0, bus.x);
            const y = Math.max(0, bus.y);

            const width = Math.min(
                bus.width,
                frame.cols - x
            );

            const height = Math.min(
                bus.height,
                frame.rows - y
            );

            if (width <= 0 || height <= 0)
                continue;

            const crop = frame.getRegion(
                new cv.Rect(x, y, width, height)
            );

            const plate = await readPlate(crop);

            let model = "Unknown";
            let operator = "";

            if (plate.plate) {

                const busInfo = findBus(
                    plate.plate
                );

                if (busInfo) {
                    model = busInfo.model;
                    operator = busInfo.operator ?? "";
                }
            }

            /*
             * Draw detection box.
             */

            frame.drawRectangle(
                new cv.Point(x, y),
                new cv.Point(
                    x + width,
                    y + height
                ),
                new cv.Vec(0, 255, 0),
                2
            );

            const label =
                `${plate.plate ?? "Plate?"} | ${model}`;

            frame.putText(
                label,
                new cv.Point(x, Math.max(25, y - 10)),
                cv.FONT_HERSHEY_SIMPLEX,
                0.7,
                new cv.Vec(0, 255, 0),
                2
            );

            if (operator) {
                frame.putText(
                    operator,
                    new cv.Point(x, y + height + 25),
                    cv.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    new cv.Vec(255, 255, 255),
                    1
                );
            }

            console.log({
                plate: plate.plate,
                plateConfidence: plate.confidence,
                model,
                operator
            });
        }

        cv.imshow(
            "Singapore Bus Identifier",
            frame
        );

        const key = cv.waitKey(1);

        if (key === 27) {
            break;
        }
    }

    camera.release();
    cv.destroyAllWindows();
}

main().catch(console.error);
