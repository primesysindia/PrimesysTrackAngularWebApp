export class CurrentStatus{
    DeviceID: string;
    DeviceType: number;
    Name: string;
    StudentId: number;
    deviceOnStatus: number;
    parentId: number;
    lan_direction: string;
    lang: string;
    lat: string;
    lat_direction: string;
    speed: string;
    time: string;
    railFeatureDto: {
        NearByDistance: string;
        distance: string;
        featureCode: string;
        featureDetail: string;
        feature_image: string;
        kiloMeter: string;
        latitude: string;
        longitude: string;
        section: string;
    }
    location: string;
    section: string;
    showSection: boolean;
    address: string = '';
}

export class batteryInfo {
    status: string;
    timestamp: string
}

export class allReportInfo {
    ActualKmCover: string;
    AvgSpeed: string;
    DeviceEndKm: number;
    DeviceEndTime: number
    DeviceId:string;
    DeviceOvespeedCount: number;
    DeviceStartKm: number;
    DeviceStartTime: number;
    DeviceStoppageCount: number;
    EndTimeDiff: number;
    ExpectedEndKm: number;
    ExpectedEndTime: number;
    ExpectedKmCover: number;
    ExpectedStartKm: number;
    ExpectedStartTime: number;
    LocationCount: number;
    MaxSpeed: number;
    Name:number;
    ReportOfDay: number;
    StartTimeDiff: number;
}

export class patrolmanReportInfo {
    ActualKmCover:number;
ActualTrip:number;
AllocatedBeat: number;
AllocatedTrip:number;
AvgSpeed:number;
DeviceEndKm:number;
DeviceEndTime:number;
DeviceOvespeedCount:number;
DeviceStartKm:number;
DeviceStartTime:number;
DeviceStoppageCount:number;
EndTimeDiff: number;
ExpectedEndKm:number;
ExpectedEndTime:number;
ExpectedKmCover:number;
ExpectedStartKm: number;
ExpectedStartTime:number;
LocationCount:  number;
MaxSpeed: number;
Name: string;
Remark: string;
ReportOfDay: number;
StartTimeDiff:number;
deviceDetailTripList: {
    ActualKmCover:number;
    ActualTrip:number;
    AllocatedBeat: number;
    AllocatedTrip:number;
    AvgSpeed:number;
    DeviceEndKm:number;
    DeviceEndTime:number;
    DeviceOvespeedCount:number;
    DeviceStartKm:number;
    DeviceStartTime:number;
    DeviceStoppageCount:number;
    EndTimeDiff: number;
    ExpectedEndKm:number;
    ExpectedEndTime:number;
    ExpectedKmCover:number;
    ExpectedStartKm: number;
    ExpectedStartTime:number;
    LocationCount:  number;
    MaxSpeed: number;
    Name: string;
    Remark: string;
    ReportOfDay: number;
    StartTimeDiff:number;
}
}