import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServicesService } from '../../services/beat-services.service';
import { Message } from 'src/app/core/message.model';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';

@Component({
  selector: 'app-pateolmen-beat-status',
  templateUrl: './pateolmen-beat-status.component.html',
  styleUrls: ['./pateolmen-beat-status.component.css']
})
export class PateolmenBeatStatusComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['DeviceId', 'KmStart', 'KmEnd', 'SectionName', 'status','VerificationDate'];
  // 'start_time1','end_time1', 'start_time2','end_time2', 'start_time3','end_time3', 'start_time4','end_time4', 'start_time5','end_time5', 'start_time6','end_time6', 'start_time7','end_time7', 'start_time8','end_time8',
  dataSource :any = [];
  loading: any;
  currUser: any;
  parId: any;

  constructor(private beatService: BeatServicesService,
    public dialog: MatDialog) { }

  ngOnInit() {
    //  this.toastr.success('Hello world!', 'Toastr fun!', {
    //   timeOut: 200000
    // });
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.loading = true;
    this.beatService.getPatrolmenExistingBeatByParent(this.parId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      console.log("data", data)
      if(data.length == 0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'NoParentList'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.dataSource = data;
        // console.log("this", this.dataSource)
      } 
      this.loading = false;
  })
  }
  // showSuccess() {
  //   this.toastr.success('Hello world!', 'Toastr fun!', {
  //     timeOut: 200000
  //   });
  // }
}


