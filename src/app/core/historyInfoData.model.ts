import { HistoryInfo, BeatInfo } from "./historyInfo.model";

export class HistoryInfoData{
    historyDataSize: number;
    historyInfo: Array<HistoryInfo>;
    beatInfo: Array<BeatInfo>;
}

export class BatteryInfoData{
    batteryLevel: number;
    deviceId: number;
    timestamp: number;
    network: number
}