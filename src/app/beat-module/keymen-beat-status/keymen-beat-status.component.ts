import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServicesService } from '../../services/beat-services.service';
import { Message } from 'src/app/core/message.model';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';

@Component({
  selector: 'app-keymen-beat-status',
  templateUrl: './keymen-beat-status.component.html',
  styleUrls: ['./keymen-beat-status.component.css']
})
export class KeymenBeatStatusComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['DeviceId', 'KmStart', 'KmEnd', 'SectionName', 'status','VerificationDate'];
  dataSource :any = [];
  loading: any;
  currUser: any;
  parId: any;

  constructor(private beatService: BeatServicesService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.loading = true;
    this.beatService.getKeymanExistingBeatByParent(this.parId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: any) => {
      // console.log("data", data)
      if(!data){
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

}
