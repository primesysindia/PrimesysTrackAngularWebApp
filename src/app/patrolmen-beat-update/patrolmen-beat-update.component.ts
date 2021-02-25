import { Component, ViewChildren, ElementRef, QueryList, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { ArrowDivDirective } from '../services/arrow-div.directive';
import { KeyboardService } from '../services/keyboard.service';
import { MatTable } from '@angular/material/table';
import { GetDeviceService } from '../services/get-device.service';
import { User } from '../core/user.model';
import { DevicesInfo, GetTripMaster } from '../core/devicesInfo.model';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect, MatDialog, MatDialogConfig} from '@angular/material';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HistoryNotFoundComponent } from '../dialog/history-not-found/history-not-found.component';
import { AddTripMasterComponent } from '../add-trip-master/add-trip-master.component';
import { OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { trigger, transition, style, animate } from '@angular/animations';
import { PateolmenUsernameDialogComponent } from '../beat-module/pateolmen-username-dialog/pateolmen-username-dialog.component';

@Component({
  selector: 'app-patrolmen-beat-update',
  templateUrl: './patrolmen-beat-update.component.html',
  styleUrls: ['./patrolmen-beat-update.component.css'],
  animations: [
    trigger('slideVerticle', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1, display: 'none' }),
        animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 })),
      ])
    ])
  ],
})


export class PatrolmenBeatUpdateComponent implements OnInit {
  private ngUnsubscribe: Subject<any> = new Subject();
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  @ViewChild(MatTable) table: MatTable<any> //used when add a row, see comment in function add()
  @ViewChild('second') second: MatTable<any>;
  displayedColumns: string[] = ['Device-No','SectionName', 'KmStart', 'KmEnd','start_time1','end_time1','start_time2','end_time2','start_time3','end_time3','start_time4','end_time4','start_time5','end_time5','start_time6','end_time6','start_time7','end_time7','start_time8','end_time8','delete'];

  tableColumns: string[] = ['DeviceName','Section','kmStart', 'kmEnd','del'];
  // deviceList: any;
  currUser: User;
  devicesList: Array<DevicesInfo>;
  devList: Array<DevicesInfo>;
  loading: boolean;
  userType: any;
  tripData: any;
  section: any;
  selected: any;
  result: any;
  patrolmenBeatForm: FormGroup;
  keymenBeatForm: FormGroup;
  patrolmenFormArray: FormArray;
  patrolmentripList: FormArray;
  keymentripList: FormArray;
  control: FormArray;
  patrolmenForm: boolean = true;
  keymenForm: boolean = true;
  showBeatCard: boolean = true;
  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>


  constructor(private keyboardServ: KeyboardService,
    private fb: FormBuilder,
    private getDevice:GetDeviceService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.patrolmenBeatForm = this.fb.group({ 
      'season': ['', Validators.required],
      'patrolmenFormArray': this.fb.array([])
    })

    this.keymenBeatForm = this.fb.group({ 
      'keymenformArray': this.fb.array([])
    })

    this.patrolmentripList = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    this.keymentripList = this.keymenBeatForm.get('keymenformArray') as FormArray;

    for (let i=0;i<5;i++) {
      this.addRow();
    }

    for (let i=0;i<3;i++) {
      this.addRowForKeymen();
    }
    this.currUser = JSON.parse(localStorage.getItem('currentUserInfo'));
    this.loading = true;
    this.getDevice.getSectionName(this.currUser.usrId).takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
      this.getDevices();
    })
    this.loading = false;
    this.keyboardServ.keyBoard.subscribe(res => {
      this.move(res)
    })
  }
  hideSeekReportCard(){
    this.showBeatCard = !this.showBeatCard
  }
  selectBeatFormType (data) {
    // console.log("data", data)
    if (data == "keymen") {
      this.keymenForm = false;
      this.patrolmenForm = true;
    }
    else if (data == "patrolmen") {
      this.patrolmenForm = false;
      this.keymenForm = true;
    }
  }
  get pf() { return this.patrolmenBeatForm.controls; }
  get kf() { return this.keymenBeatForm.controls; }


  get getFormControls() {
    const control = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    return control;
  }

  ngAfterOnInit() {
    this.control = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
  }

  // patrolmen form array
  createPatrolmenBeat (): FormGroup {
    return this.fb.group({
      DeviceNo: ['', Validators.required],
      SectionName: ['', Validators.required],
      KmStart:  ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      KmEnd: ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      start_time1: ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time2:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time3:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time4:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time5:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time6:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time7:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      start_time8:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time1: ['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time2:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time3:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time4:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time5:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time6:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time7:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
      end_time8:['', [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)]],
    })
  }
  addRow() {
    const control =  this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    control.push(this.createPatrolmenBeat());
  }

  delete(index: number) {
    // this.patrolmenFormArray.removeAt(index);
    const control =  this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
    if (index > 0)
      control.removeAt(index);
    this.table.renderRows()
  }

  // add row one by one to the table
  add() {
    this.patrolmentripList.push(this.createPatrolmenBeat());
    this.table.renderRows()
  }
  
  move(object) {
    const inputToArray = this.inputs.toArray()
    const rows = this.patrolmenFormArray.length
    const cols = this.displayedColumns.length
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
          // console.log("loh", this.devList)
          // this.deviceFilter();
          this.GetRailwayPetrolmanTripsMaster()
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

  GetRailwayPetrolmanTripsMaster() {
    this.loading = true;
    this.getDevice.GetRailwayPetrolmanTripsMaster(this.currUser.usrId).subscribe(data => {
      this.loading = false;
      this.tripData = data;
    })  
    this.loading = false;
  }
   // open dialog of add patrolman trip master
   openMasterDialog(): void {
    let dialogRef = this.dialog.open(AddTripMasterComponent, {
      width: '600px',
    }).afterClosed().subscribe((result) => {
    })
  }

  // submit() {
  //   const control = this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray;
  //   console.log("values", this.patrolmenBeatForm.value);
  //   // console.log("values", control);

    
  // }

  submit() {
    // if(this.patrolmenBeatForm.invalid) {
    //   return
    // } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        maxWidth: '600px',
        data: this.patrolmenBeatForm.value,
    };
      // dialogConfig.data = this.keymenBeatForm.value
      // dialogConfig.maxWidth= "400px";

        let dialogRef = this.dialog.open(PateolmenUsernameDialogComponent, dialogConfig)
        .afterClosed().subscribe(dialogResult => {
          this.result = dialogResult;
        });
    // }
    
  }

  // keymen block starts
  deviceImei: any;
  deviceName: any;
  devices: any;
  onSelection(event) {
    console.log(event)
    this.deviceImei = event.imei_no;
    this.deviceName = event.name;
    console.log("this.deviceImei", this.deviceImei)
    console.log("this.deviceName", this.deviceName)
  }
  createKeymenBeat (): FormGroup {
    return this.fb.group({
      DeviceName: [''],
      Section: new FormControl(''),
      kmStart: new FormControl(this.deviceImei),
      kmEnd: new FormControl(this.deviceName),
    })
  }
  addRowForKeymen() {
    const controls =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    controls.push(this.createKeymenBeat());
  }
  addextraRowsForKeymen() {
    this.keymentripList.push(this.createKeymenBeat());
    this.second.renderRows()
  }

  get getKeymenFormControls() {
    const controls = this.keymenBeatForm.get('keymenformArray') as FormArray;
    return controls;
  }

  deleteRow(index: number) {
    // this.patrolmenFormArray.removeAt(index);
    const control =  this.keymenBeatForm.get('keymenformArray') as FormArray;
    if (index > 0)
      control.removeAt(index);
    this.second.renderRows();
  }
}
