export class DevicesInfo{
    student_id: string;
	remaining_days_to_expire: string;
	name: string;
	path: string;
	type: string;
	imei_no: string;
	expiary_date: string;
	status: string;
	ShowGoogleAddress: string;
	liveStatusImg: string;
}

export interface GetTripMaster {
	beatId: number,
	createdBy: string,
	fk_TripMasterId: number,
	parentId: number,
	seasonId: number,
	studentId: number,
	tripName: string,
	tripSpendTimeIntervalAdd: string,
	tripStartTimeAdd: string,
	tripTimeShedule: string,
	userLoginId: number
  }