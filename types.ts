export interface BusDetection {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
}

export interface PlateResult {
    plate: string | null;
    confidence: number;
}

export interface BusInfo {
    registration: string;
    model: string;
    operator?: string;
    service?: string;
}

export interface BusResult {
    detection: BusDetection;
    plate: PlateResult;
    model: string;
    operator?: string;
    service?: string;
}
