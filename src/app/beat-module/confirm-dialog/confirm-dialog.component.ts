import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { BeatServicesService } from '../../services/beat-services.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/core/message.model';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  loading : boolean;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,  
    public dialog: MatDialog,
    private beatService: BeatServicesService,
    private router: Router) { }

  ngOnInit() {
    // console.log(this.data);
  }
  onConfirm(): void {
    // Close the dialog, return true
    this.loading = true;
   this.beatService.saveKeymenBeats(this.data).takeUntil(this.ngUnsubscribe)
    .subscribe((data: Message)=>{
       if(data.error == "true"){
        this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'beatNotAdded'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else {
          this.dialogRef.close();
          // console.log("data", data)
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'beatAdded'
          };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        this.router.navigate(['/', 'keymen-beat-status']);
        }
    })
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close('0');
  }
}
