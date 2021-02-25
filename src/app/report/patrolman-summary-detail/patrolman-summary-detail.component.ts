import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { patrolmanReportInfo} from '../../core/currentStatus.model';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-patrolman-summary-detail',
  templateUrl: './patrolman-summary-detail.component.html',
  styleUrls: ['./patrolman-summary-detail.component.css']
})
export class PatrolmanSummaryDetailComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loading: boolean = false;
  // tableHeader: Array<string> = [];
  dataSource :any = [];
  reportData: MatTableDataSource<patrolmanReportInfo>;
  parent_id: any;
  tableHeader = ['srNo', 'DeviceStartTime','ExpectedStartTime','DeviceStartKm', 'ExpectedStartKm', 'DeviceEndTime', 'ExpectedEndTime','DeviceEndKm', 'ExpectedEndKm', 'MaxSpeed', 'ActualKmCover'];
   deviceName: any;         
  constructor(public dialogRef: MatDialogRef<PatrolmanSummaryDetailComponent>,
    private reportServ: ReportService, @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = true;
    if(this.data.length == 0) {
     this.loading = false;
     const dialogConfig = new MatDialogConfig();
     //pass data to dialog
     dialogConfig.data = {
       hint: 'noTripsAvailable'
     };
     const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)  
   }else {
     this.loading = false;
     this.reportData = new MatTableDataSource<patrolmanReportInfo>(this.data.deviceDetailTripList);
     this.dataSource = this.reportData.data;
     this.deviceName = this.dataSource[0].Name;
    //  console.log("this.dataSource", this.dataSource);
    //  this.dataSource.paginator = this.paginator;
    //  this.dataSource.sort = this.sort;
  }
  }
  onNoClick() {
    this.dialogRef.close()
  }
}
