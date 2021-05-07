import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTooltipModule } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { BeatServicesService } from '../../services/beat-services.service';
import { Message } from 'src/app/core/message.model';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { getApprovalBeats} from '../../core/beatInfo.model';

@Component({
  selector: 'app-all-keymen-existing-beats',
  templateUrl: './all-keymen-existing-beats.component.html',
  styleUrls: ['./all-keymen-existing-beats.component.css']
})
export class AllKeymenExistingBeatsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  tableHeader: Array<string> = ['DeviceName', 'KmStart', 'KmEnd', 'SectionName'];
  dataSource : MatTableDataSource<getApprovalBeats>;
  loading: any;
  currUser: any;
  parId: any;
  response: any;
  responseData: any;

  constructor(private beatService: BeatServicesService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.loading = true;
    this.beatService.getKeymanExistingBeatByParent(this.parId)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data: Array<getApprovalBeats>) => {
      // console.log("data", data)
      if(data.length==0){
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'beatNotFound'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
      else {
        this.responseData = data;
        this.response = new MatTableDataSource<getApprovalBeats>(this.responseData);
        this.dataSource = this.response;
        this.dataSource.paginator = this.paginator;
        // console.log("this", this.dataSource)
      } 
      this.loading = false;
  })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
