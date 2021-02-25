import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReportComponent } from '../report.component';
import { patrolmanReportInfo} from '../../core/currentStatus.model';
import { PatrolmanSummaryDetailComponent } from '../../report/patrolman-summary-detail/patrolman-summary-detail.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';

@Component({
  selector: '[app-trip-report]',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.css']
})
export class TripReportComponent implements OnInit {

  @Input() trpRepoData: any;
  @Input() index: number;
  @Output() totalDist: EventEmitter<number> = new EventEmitter();
  @Output() stopMins = new EventEmitter();
  previousEndTime: number;
  nextStartTime: number;
  stoppageMins: number;
  tripRepo: boolean;
  monitorRepo: boolean;
  deviceSignalRepo: boolean;
  batteryStatRepo: boolean;
  dateRangeExceptionRepo: boolean;
  allSummaryReport: boolean;
  allPatrolmanSummaryReport: boolean;
  patrolReportData: any;
  dataSource: MatTableDataSource<patrolmanReportInfo>;
  tableHeader: Array<string> = ['Name','AllocatedBeat','ExpectedStartTime'];
  constructor(private rep: ReportComponent, public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.patrolReportData = this.rep.patrolmanSummaryReport
    this.dataSource = this.patrolReportData;
    // console.log("report type", this.rep)
    if(this.rep.selReportType == 'Trip Report' || this.rep.selReportType == 'Monthly Report'){
      this.tripRepo = true;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
      this.deviceSignalRepo = false;
      this.allSummaryReport = false;
      this.allPatrolmanSummaryReport = false;
    }
    else if(this.rep.selectedReportType == 'Device_Signal_Info'){
      this.deviceSignalRepo = true
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
      this.allSummaryReport = false;
      this.allPatrolmanSummaryReport = false;
    }
    else if(this.rep.selectedReportType == 'ReportSummary'){
      this.allSummaryReport = true;
      this.deviceSignalRepo = false;
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo = false;
      this.allPatrolmanSummaryReport = false;
    }
    else if(this.rep.selectedReportType == 'Patrolman_Report_Summary'){
      this.allPatrolmanSummaryReport = true;
      this.allSummaryReport = false;
      this.deviceSignalRepo = false;
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
    }
    else if(this.rep.selectedReportType == 'MonitorSOSPress'){
      this.tripRepo = false;
      this.monitorRepo = true;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =false;
      this.deviceSignalRepo = false;
      this.allSummaryReport = false;
      this.allPatrolmanSummaryReport = false;
    }
    else if(this.rep.selectedReportType  == 'DeviceBatteryStatus'){
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = true;
      this.deviceSignalRepo = false;
      this.dateRangeExceptionRepo =false;
      this.allSummaryReport = false;
      this.allPatrolmanSummaryReport = false;
    }
    else if(this.rep.selectedReportType == "DateRangeExceptionReport"){
      this.tripRepo = false;
      this.monitorRepo = false;
      this.batteryStatRepo = false;
      this.dateRangeExceptionRepo =true;
      this.deviceSignalRepo = false;
      this.allSummaryReport = false;
      this.allPatrolmanSummaryReport = false;
    }
    if(this.rep.selReportType == 'Trip Report' || this.rep.selReportType == 'Monthly Report'){
      if(this.index == 0){
        this.rep.totalDistance = +this.trpRepoData.totalkm;
      }
      else{
        this.rep.totalDistance = this.rep.totalDistance + (+this.trpRepoData.totalkm)
      }
      if(this.index == this.rep.tripRepo.length-1){
        this.totalDist.emit(this.rep.totalDistance)
      }
    }
  }

  getStoppageMins(){
    if(this.index == 0){
      this.stoppageMins = 0;
      this.stopMins.emit(this.stoppageMins)
    }
    else{
      this.previousEndTime= +this.rep.tripRepo[this.index-1].desttimestamp
      this.nextStartTime = +this.trpRepoData.srctimestamp
      this.stoppageMins = (this.nextStartTime-this.previousEndTime)/(60)
      this.stopMins.emit(this.stoppageMins)
    }
    return this.stoppageMins;
  }

  openDetailDialog(data) {
    // console.log("data", data)
    const dialogConfig = new MatDialogConfig();

    // this.beatService.getIssueDetailById(issueId).subscribe((res: Array<IssueList>)=> {
      dialogConfig.width = '900';
      dialogConfig.height = '530px';
      dialogConfig.data = data;
      // console.log("id",dialogConfig.data)

      let dialogRef = this.dialog.open(PatrolmanSummaryDetailComponent, dialogConfig)
      .afterClosed().subscribe((result) => {
      })
  // }
}
}