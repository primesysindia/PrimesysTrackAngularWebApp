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
import { BeatServicesService } from '../services/beat-services.service';
import { ToastrService } from 'ngx-toastr';

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
  season_id: any;
  existingData: any;
  beatData: any;
  existingKmStart: any;
  existingKmEnd: any;
  existingStartTime: any;
  existingEndTime: any;
  existingBeatId1: any;
  existingBeatId2: any;
  existingBeatId3: any;
  existingBeatId4: any;
  existingBeatId5: any;
  existingBeatId6: any;
  existingBeatId7: any;
  existingBeatId8: any;
  existingtripmaster1: any;
  existingtripmaster2: any;
  existingtripmaster3: any;
  existingtripmaster4: any;
  existingtripmaster5: any;
  existingtripmaster6: any;
  existingtripmaster7: any;
  existingtripmaster8: any;
  existingSection: any;
  hierarchyData: any;
  parId: any;
  filteredDevices: any;

  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>


  constructor(private keyboardServ: KeyboardService,
    private fb: FormBuilder,
    private getDevice:GetDeviceService,
    private beatService: BeatServicesService,private toastr: ToastrService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.patrolmenBeatForm = this.fb.group({ 
      'seasonId': ['', Validators.required],
      'hierarchy':['', Validators.required],
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
    this.parId = this.currUser.usrId;
    this.GetRailwayDeptHierarchy(this.parId)
    this.loading = true;
    this.getDevice.getSectionName(this.currUser.usrId).takeUntil(this.ngUnsubscribe)
    .subscribe(data => {
      this.loading = false;
      this.section = data;
      // this.getDevices();
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
    this.control = this.patrolmenBeatForm.get('patrolmenFormArray ')as FormArray;
  }

  // patrolmen form array
  createPatrolmenBeat (): FormGroup {
    return this.fb.group({
      StudentId: ['', Validators.required],
      SectionName: ['', Validators.required],
      KmStart:  ['', [Validators.required, Validators.pattern(/^\d*([.\/]?\d+)$/)]],
      // KmStart: new FormControl(this.existingData.kmStart, Validators.required),
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
      BeatId1:['0'],
      BeatId2:['0'],
      BeatId3:['0'],
      BeatId4:['0'],
      BeatId5:['0'],
      BeatId6:['0'],
      BeatId7:['0'],
      BeatId8:['0'],
      tripMasterId1:['0'],
      tripMasterId2:['0'],
      tripMasterId3:['0'],
      tripMasterId4:['0'],
      tripMasterId5:['0'],
      tripMasterId6:['0'],
      tripMasterId7:['0'],
      tripMasterId8:['0']
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


  GetRailwayDeptHierarchy(parentId) {
    this.devList = [];
    this.loading = true;
    this.beatService.GetRailwayDepHierarchy(parentId).subscribe((res)=> {
      this.loading = false;
      this.hierarchyData = res;
    },(err) => {
      this.loading = false;
        const dialogConfig = new MatDialogConfig();
            //pass data to dialog
            dialogConfig.data = {
              hint: 'ServerError'
            };
        const dialogRef = this.dialog.open(HistoryNotFoundComponent, dialogConfig)
    })
  }

  getSelectedDevice(event) {
    // this.selectedDeviceArray = [];
    ((this.keymenBeatForm.get('keymenformArray') as FormArray)).reset();
    ((this.keymenBeatForm.get('keymenformArray') as FormArray)).enable();
    // console.log(event.hirachyParentId);
    this.getDevices(event.hirachyParentId);
  }

  getDevices(pId){
    this.loading = true;
    this.getDevice.getAllDeviceList(pId)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: Array<DevicesInfo>) => {
        console.log("data", data)
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
          this.filteredDevices = this.devList.filter(p => String(p.name).startsWith('P/'));
          // console.log("loh", this.devList)
          // this.deviceFilter();
          // this.GetRailwayPetrolmanTripsMaster()
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

  onChange(data, index: number) {
    console.log("data", data)
    this.season_id = this.patrolmenBeatForm.get('seasonId').value;
    
    // console.log("season_id", this.season_id)
    this.beatService.getPatrolmenBeatByStdId(data.student_id, this.season_id)
    .takeUntil(this.ngUnsubscribe)
    .subscribe((data) => {
      console.log("data",data)
      this.existingKmStart = data[0].kmStart;
      this.existingKmEnd = data[0].kmEnd;
      this.existingStartTime = data[0].startTime;
      this.existingEndTime = data[0].endTime;
      this.existingBeatId1 = data[0].BeatId;
      this.existingSection = data[0].sectionName;

      // console.log("eciij",  this.existingData[0])
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('KmStart').patchValue(this.existingKmStart);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('KmEnd').patchValue(this.existingKmEnd);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('SectionName').patchValue(this.existingSection);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('start_time1').patchValue(this.existingStartTime);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('end_time1').patchValue(this.existingEndTime);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId1').patchValue(this.existingBeatId1);
       ((this.patrolmenBeatForm.get('patrolmenFormArray') as FormArray).at(index) as FormGroup).get('BeatId2').patchValue(this.existingBeatId2);
    })
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

  submit() {
    console.log("data", this.patrolmenBeatForm.value)
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '350px';
      dialogConfig.data = {
        // maxWidth: '600px',
        data: this.patrolmenBeatForm.value,
    };
    let dialogRef = this.dialog.open(PateolmenUsernameDialogComponent, dialogConfig)
    .afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
    });
  }

  // keymen block starts
  deviceImei: any;
  deviceName: any;
  devices: any;
  onSelection(event) {
    console.log(event)
    this.deviceImei = event.imei_no;
    this.deviceName = event.name;
    // console.log("this.deviceImei", this.deviceImei)
    // console.log("this.deviceName", this.deviceName)
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
