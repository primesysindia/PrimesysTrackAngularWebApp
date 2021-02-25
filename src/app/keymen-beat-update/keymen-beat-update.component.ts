import { Component, OnInit, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { ArrowDivDirective } from '../services/arrow-div.directive';
import { KeyboardService } from '../services/keyboard.service';
import { MatTable } from '@angular/material/table';
import { GetDeviceService } from '../services/get-device.service';
import { User } from '../core/user.model';
import { DevicesInfo, GetTripMaster } from '../core/devicesInfo.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { BeatServicesService } from '../services/beat-services.service';
import { Message } from 'src/app/core/message.model';
import { ConfirmDialogComponent } from '../beat-module/confirm-dialog/confirm-dialog.component';
import { UsernameDialogComponent } from '../beat-module/username-dialog/username-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-keymen-beat-update',
  templateUrl: './keymen-beat-update.component.html',
  styleUrls: ['./keymen-beat-update.component.css']
})

export class KeymenBeatUpdateComponent implements OnInit {  
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild('second') second: MatTable<any>;
  tableColumns: string[] = ['DeviceName','Section','kmStart', 'kmEnd','del','add'];
  // deviceList: any;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  loading: boolean;
  userType: any;
  section: any;
  deviceImei: any;
  deviceName: any;
  devices: any;
  keymenBeatForm: FormGroup;
  keymenformArray: FormArray;
  keymentripList: FormArray;
  control: FormArray;
  parId: any;
  result: any;
  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>

  constructor(private keyboardServ: KeyboardService,
    private fb: FormBuilder,
    private getDevice:GetDeviceService,
    private beatService: BeatServicesService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.keymenBeatForm = this.fb.group({ 
      'keymenformArray': this.fb.array([])
    })
    this.keymentripList = this.keymenBeatForm.get('keymenformArray') as FormArray;

    for (let i=0;i<10;i++) {
      this.addRowForKeymen();
    }
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.parId = this.currUser.usrId;
    this.loading = true;
    this.getDevice.getSectionName(this.currUser.usrId).takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
      // console.log("sec", this.section)
      this.getDevices();
    })
    this.loading = false;
    this.keyboardServ.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  get kf() { return this.keymenBeatForm.controls; }

  move(object) {
    const inputToArray = this.inputs.toArray()
    const rows = this.keymenformArray.length
    const cols = this.tableColumns.length
    let index = inputToArray.findIndex(x => x.element === object.element)
    switch (object.action) {
      case "UP":
        index--;
        break;
      case "DOWN":
        index++;
        break;
      case "LEFT":
        if (index - rows >= 0)
          index -= rows;
        else {
          let rowActual = index % rows;
          if (rowActual > 0)
            index = (rowActual - 1) + (cols - 1) * rows;
        }
        break;
      case "RIGTH":
        console.log(index + rows, inputToArray.length)
        if (index + rows < inputToArray.length)
          index += rows;
        else {
          let rowActual = index % rows;
          if (rowActual < rows - 1)
            index = (rowActual + 1);

        }
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
    }
  }

  getDevices(){
    this.deviceImei = '';
    this.deviceName = '';
    this.loading = true;
    this.getDevice.getAllDeviceList(this.currUser.usrId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
        // console.log("data", data)
        if(data.length == 0){
          this.loading = false;
          const dialogConfig = new MatDialogConfig();
          //pass data to dialog
          dialogConfig.data = {
            hint: 'NoDeviceList'
          };
          const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
        }
        else{
          this.devList = data;
          this.loading = false;
        }
      },
      (error: any) => { 
        this.loading = false;
        const dialogConfig = new MatDialogConfig();
        //pass data to dialog
        dialogConfig.data = {
          hint: 'ServerError'
        };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
      }
    )
  }

  onSelection(event) {
    // console.log(event)
    this.deviceImei = event.imei_no;
    this.deviceName = event.name;
    // console.log("this.deviceImei", this.deviceImei)
    // console.log("this.deviceName", this.deviceName)
  }
  createKeymenBeat (): FormGroup {
    return this.fb.group({
      'studentId': ['', Validators.required],
      'sectionName': ['', Validators.required],
      'kmStart': ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      'kmEnd': ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]], 
      // 'start_time': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      // 'end_time': ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
    })
  }
  addRowForKeymen() {
    const controls = this.keymenBeatForm.get('keymenformArray') as FormArray;
    controls.push(this.createKeymenBeat());
  }
  addextraRowsForKeymen() {
    const controls =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    controls.push(this.createKeymenBeat());
    this.second.renderRows()
  }
  public hasErrorInSetPeriod = (controlName: string, errorName: string) =>{
    return this.keymenBeatForm.controls[controlName].hasError(errorName);
  }
  get getKeymenFormControls() {
    const controls = this.keymenBeatForm.get('keymenformArray') as FormArray;
    return controls;
  }

  getTripsFormGroup(index): FormGroup {
    const formGroup = this.keymentripList.controls[index] as FormGroup;
    return formGroup;
  }

  deleteRow(index: number) {
    const control =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    if (index > 0)
      control.removeAt(index);
    this.second.renderRows();
  }
 
//   public findInvalidControls() {
//     const invalid = [];
//     const controls = this.keymenBeatForm.controls;
//     for (const name in controls) {
//         if (controls[name].invalid) {
//             invalid.push(name);
//         }
//     }
//     return invalid;
// }

  submit() {
    // if(this.keymenBeatForm.get('keymenformArray').value == '') {
    //   alert("remove extra fields")
    //   console.log("remove extraaa")
    // }
    if(this.keymenBeatForm.invalid) {
      return
    }
     else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '600px';
      dialogConfig.data = {
        // width: '600px',
        // height: '300px',
        data: this.keymenBeatForm.value,
    };
      // dialogConfig.data = this.keymenBeatForm.value
      // dialogConfig.maxWidth= "400px";

        let dialogRef = this.dialog.open(UsernameDialogComponent, dialogConfig)
        .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
        });
    }
    
  }
}
