import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../../dialog/history-not-found/history-not-found.component';
import { BeatServicesService } from '../../services/beat-services.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pateolmen-username-dialog',
  templateUrl: './pateolmen-username-dialog.component.html',
  styleUrls: ['./pateolmen-username-dialog.component.css']
})
export class PateolmenUsernameDialogComponent implements OnInit {
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  keymenUserBeatForm: FormGroup;
  patrolmenUserBeatForm: FormGroup;
  receivedData: any;
  currUser: any;
  parId: any;
  result: any;

  constructor(public dialogRef: MatDialogRef<PateolmenUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    private fb: FormBuilder,
    private beatService: BeatServicesService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;

    this.receivedData = this.data.data;
    // console.log(this.receivedData);
    //  this.keymenUserBeatForm = this.fb.group({ 
    //   'name': ['', Validators.required],
    //   'contactNo': ['', Validators.required],
    //   'checkbox': ['', Validators.required]
    // })

    this.patrolmenUserBeatForm = this.fb.group({ 
      'name': ['', Validators.required],
      'contactNo': ['', Validators.required],
       'checkbox': ['', Validators.required]
    })
  }
 

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close('0');
  }

  submitPatrolmenForm() {
    let params =  {
      parentId : this.parId,
      userLoginId: this.parId
    }
    if(this.patrolmenUserBeatForm.invalid) {
      return
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = JSON.stringify(Object.assign(params,this.patrolmenUserBeatForm.value, this.receivedData))
      // console.log("dialog", dialogConfig.data) 
      dialogConfig.maxWidth= "400px";
        let dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig)
        .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
          this.dialogRef.close();
        });
       
    }
  }

}
