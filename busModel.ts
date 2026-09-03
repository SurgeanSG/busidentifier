import fs from "fs";
import path from "path";
import { BusInfo } from "./types";

const databasePath = path.join(
    process.cwd(),
    "data",
    "fleet.json"
);

let fleet: BusInfo[] = [];

export function loadFleet(): void {
    fleet = JSON.parse(
        fs.readFileSync(databasePath, "utf8")
    );
}

export function findBus(
    registration: string
): BusInfo | null {

    const normalized = registration
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");

    /*
     * First try an exact registration.
     */

    const exact = fleet.find(
        bus =>
            bus.registration
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "") === normalized
    );

    if (exact) {
        return exact;
    }

    /*
     * If the exact bus isn't in the database,
     * return null rather than guessing.
     */

    return null;
}
