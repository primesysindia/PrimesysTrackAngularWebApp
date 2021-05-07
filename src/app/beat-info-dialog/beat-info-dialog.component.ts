import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-beat-info-dialog',
  templateUrl: './beat-info-dialog.component.html',
  styleUrls: ['./beat-info-dialog.component.css']
})
export class BeatInfoDialogComponent implements OnInit {
  loading: boolean;
  beatInfo: any;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(public dialogRef: MatDialogRef<BeatInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog) {}

  ngOnInit() {
    this.getBeatInfoDetail();
  }

  getBeatInfoDetail() {
    // this.loading = true;
     if(this.data.length == 0) {
      this.loading = false;
      const dialogConfig = new MatDialogConfig();
      //pass data to dialog
      dialogConfig.data = {
        hint: 'beatNotFound'
      };
      const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)  
    }else {
      this.loading = false;
      this.beatInfo = this.data;
    }
    this.loading = false;
  }

  closeBtn() {
    this.dialogRef.close()
  }

}
