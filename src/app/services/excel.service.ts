import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { DatePipe } from 'node_modules/@angular/common';
import * as logoFile from './companyLogo.js';
import * as fs from 'file-saver';
import { TripReportInfo } from '../core/tripReport.model.js';
import { MonitorSos } from '../core/monitorSos.model.js';
import { batteryInfo, allReportInfo, patrolmanReportInfo } from '../core/currentStatus.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private datePipe: DatePipe) { }

  // applyAnotherStyle(divisionName,worksheets) {
  //   divisionName.font = { name: 'Times New Roman', family: 4, size: 12, bold: true }
  //   divisionName.alignment = {
  //     horizontal: 'center'
  //   }
  //     worksheets.mergeCells('A3:I3');
  //     worksheets.mergeCells('A1:I2');
  // }
  applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName){
    //report name style
    titleRow.font = { name: 'Times New Roman', family: 4, size: 16, underline: 'double', bold: true }
    titleRow.alignment = {
      horizontal: 'center',
      verticle: 'center'
    }
    //vehicle details & datetime style
    subTitleRow.font = { name: 'Times New Roman', family: 4, size: 12, bold: true }
    subTitleRow.alignment = {
      horizontal: 'center'
    }
    subTitleRow.color = 'blue';
    //rows & cols style
    if(reportName=="Trip Report" || reportName == "Monthly Report"){
      worksheet.mergeCells('A3:I3');
      worksheet.mergeCells('A1:I2');
    }
    else if(reportName=="Device On Report" || reportName == "Device Off Report" || reportName == "Device Current Status" || reportName == 'Monitor SOS Press' 
              || reportName == 'Today'+"'"+'s Device Status' ||  reportName == "Device ON OFF Status" || reportName == 'Device Signal Info'  || reportName == 'ReportSummary'){
      worksheet.mergeCells('A3:G3');
      worksheet.mergeCells('A1:G2');
    }
    else if(reportName == 'Patrolman_Report_Summary'){
      worksheet.mergeCells('A3:I3');
      worksheet.mergeCells('A1:I2');
      
    }
    else if(reportName == "Device Battery Status"){
      worksheet.mergeCells('A3:E3');
      worksheet.mergeCells('A1:E2');
      
    }
    //Add Image
    // let logo = workbook.addImage({
    //   base64: logoFile.logoBase64,
    //   extension: 'png',
    // });
    // worksheet.addImage(logo, 'A1:A2');
    //header row Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.alignment = {
        horizontal: 'center',
        verticle: 'center'
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    
  }

  generateTripExcel(reportName,DeviceName,reportDate,tableHeader,data: Array<TripReportInfo>,stoppageMins,totalDistance,endDate?){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName, subTitleRow;
    //Add Row
    let titleRow = worksheet.addRow([reportName]);
   
    worksheet.addRow([]);
    if(reportName == "Trip Report"){
        subTitleRow = worksheet.addRow([DeviceName+' '+'Date : ' + this.datePipe.transform(reportDate, 'mediumDate')])
        FileName = reportName.replace(/\s/g, "")+'_'+DeviceName+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    }
    else{
        subTitleRow = worksheet.addRow([DeviceName+'                           From Date : ' + this.datePipe.transform(reportDate, 'mediumDate')
                                            +' To Date : ' + this.datePipe.transform(endDate, 'mediumDate')])
        FileName = reportName.replace(/\s/g, "")+'_'+DeviceName+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")+'To'+this.datePipe.transform(endDate, 'MMM d').replace(/\s/g, "")
    }

    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)

    let i=1;
    data.forEach(item =>{
      let vals=[];
      vals.push(i);
      if (+item.srctimestamp > 0)
          vals.push(this.datePipe.transform(+item.srctimestamp*1000, 'MMM d, y HH:mm'));
      else 
        vals.push('--')
      // vals.push(this.datePipe.transform(+item.srctimestamp*1000, 'MMM d, y HH:mm '));
      vals.push(item.src_adress);
      if (+item.desttimestamp > 0)
        vals.push(this.datePipe.transform(+item.desttimestamp*1000, 'MMM d, y HH:mm'));
      else 
        vals.push('--')
      // vals.push(this.datePipe.transform(+item.desttimestamp*1000, 'MMM d, y HH:mm '));
      vals.push(item.dest_address);
      vals.push(stoppageMins[i-1].toFixed(2))
      vals.push(item.avgspeed);
      vals.push(item.maxspeed);
      let total = +item.totalkm
      vals.push(total.toFixed(2));
      worksheet.addRow(vals);
      i++;
    })
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(9).width = 15;

    let totalKms = worksheet.addRow(['Total Distance: '+totalDistance.toFixed(2)]);
    let color = 'FF99FF99';
    totalKms.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    }
    totalKms.alignment = {
      horizontal: 'right'
    }

    worksheet.mergeCells(`A${totalKms.number}:I${totalKms.number}`);
    
    /* or */
    //worksheet.addRows(data);

    this.saveFile(workbook,FileName)

  }//end method

  generateCurrentStatusExcel(reportName,reportDate,deviceOnStatus,deviceOffStatus,tableHeader,offDevicesCnt,onDevicesCnt,reportTime){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    let subTitleRow;
    //Add Row and formatting
    let titleRow = worksheet.addRow([reportName]);
    
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(reportDate, 'mediumDate')+'                          Total OFF Devices: '+offDevicesCnt+
                                        ', Total ON Devices: '+onDevicesCnt])
    //Generated date
    let generateDt = worksheet.addRow(['Generated on: '+this.datePipe.transform(reportTime, 'MMM d, y HH:mm')])
    generateDt.alignment = {
      horizontal: 'right'
    }
    worksheet.mergeCells('A4:G4');
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Device On Report' || reportName == 'Device Off Report'){
      deviceOffStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('OFF');
        vals.push('-')
        vals.push('-');
        vals.push('-');
        vals.push('-');
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      deviceOffStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('OFF');
        // vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm '))
        if (item.time > 0)
          vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        else 
        vals.push('--')
        // vals.push(item.address);
        vals.push(item.lat);
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    if(reportName == 'Device On Report' || reportName == 'Device Off Report'){
      deviceOnStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('ON');
        if (item.time > 0)
          vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        else 
        vals.push('--')
        // vals.push(item.address);
        vals.push(item.lat)
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      deviceOnStatus.forEach(item =>{
        let vals=[];
        vals.push(i)
        vals.push(item.Name);
        vals.push('ON');
        if (item.time > 0)
        vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        else 
          vals.push('--')
        // vals.push('Section: '+item.section+', '+item.address);
        vals.push(item.lat)
        vals.push(item.lang);
        worksheet.addRow(vals);
        i++;
      })
    }
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    
    this.saveFile(workbook,FileName)
  
  }//end method

  generateMonitorSOSExcel(reportName,reportDate,data: Array<MonitorSos>,tableHeader){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(reportDate, 'MMM d').replace(/\s/g, "")
    let subTitleRow;
    //Add Row and formatting
    let titleRow = worksheet.addRow([reportName]);
    
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(reportDate, 'mediumDate')])
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Monitor SOS Press'){
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.gpsDeviceName);
        // vals.push(item.address);
        
        vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        vals.push(item.gsm_signal_strength);
        vals.push(item.speed);
        vals.push(item.voltage_level);
        worksheet.addRow(vals);
        i++;
      })
    }
    else{
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.gpsDeviceName);
        if (+item.time > 0)
          vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        else 
          vals.push('--')
        // vals.push(this.datePipe.transform(+item.time*1000, 'MMM d, y HH:mm'));
        vals.push(item.gsm_signal_strength);
        vals.push(item.voltage_level);
        worksheet.addRow(vals);
        i++;
      })
    }
    if(reportName == 'Monitor SOS Press'){
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 40;
      worksheet.getColumn(4).width = 30;
      worksheet.getColumn(5).width = 10;
      worksheet.getColumn(6).width = 10;
      worksheet.getColumn(7).width = 10;
    }
    else{
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 15;
      worksheet.getColumn(3).width = 30;
      worksheet.getColumn(4).width = 10;
      worksheet.getColumn(5).width = 10;
    }

    this.saveFile(workbook,FileName)
  
  }//end method

  generateDateRangeExceptionExcel(reportName,data,tableHeader,startDt,endDt){
     //Create workbook and worksheet
    let workbook = new Excel.Workbook();

    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName, subTitleRow;
    //Add Row
    let titleRow = worksheet.addRow([reportName]);
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow(['Date From: ' + this.datePipe.transform(startDt, 'mediumDate')
                                          +' To: ' + this.datePipe.transform(endDt, 'mediumDate')])
    FileName = reportName.replace(/\s/g, "")+'_'+this.datePipe.transform(startDt, 'MMM d').replace(/\s/g, "")+'To'+this.datePipe.transform(endDt, 'MMM d').replace(/\s/g, "")
    titleRow.font = { name: 'Times New Roman', family: 4, size: 16, underline: 'double', bold: true }
    titleRow.alignment = {
      horizontal: 'center',
      verticle: 'center'
    }
    //vehicle details & datetime style
    subTitleRow.font = { name: 'Times New Roman', family: 4, size: 12, bold: true }
    subTitleRow.alignment = {
      horizontal: 'center'
    }
    worksheet.font = {
      name: 'Times New Roman',
      border: 'thin'
    }
   /*  worksheet.getColumn('B').font = {
      name: 'Times New Roman',
      color: { argb: "004e47cc" }
    }; */
    worksheet.mergeCells('A3:E3');
    worksheet.mergeCells('A1:E2');
   
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    
    let headerRow = worksheet.addRow(tableHeader);
    //set style to file
    //header row Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    let i=1;
    data.forEach(item => {
      worksheet.addRow(item);
    })

    worksheet.getColumn(1).width = 25;

    this.saveFile(workbook,FileName)
  }//end method

  generateDeviceSignalExcel(reportName,data: Array<batteryInfo>,tableHeader){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/_/g, " ")
    let subTitleRow;
    //Add Row and formatting
    let titleRow = worksheet.addRow([reportName]);
    
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Device Signal Info'){
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.status.replace(/_/g, " "));
        if (+item.timestamp > 0)
          vals.push(this.datePipe.transform(+item.timestamp*1000, 'MMM d, y HH:mm'));
        else 
          vals.push('--')
        // vals.push(this.datePipe.transform(+item.timestamp*1000, 'MMM d, y, HH:mm' ));
        worksheet.addRow(vals);
        i++;
      })
    }
    
    if(reportName == 'Device Signal Info'){
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 40;
      worksheet.getColumn(3).width = 30;
      
    }

    this.saveFile(workbook,FileName)
  
  }//end methos
  //to download the file

  generateReportSummaryExcel(reportName,data: Array<allReportInfo>,tableHeader, filterType, date, division){
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = 'Keymen Summary Report'
    let subTitleRow; let titleRow;

    if (filterType == ' ' || !filterType) {
      titleRow = worksheet.addRow([FileName + '(' + 'All' + ')'+ '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    } else {
      titleRow = worksheet.addRow([FileName + '(' + filterType + ')'+ '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    }
     worksheet.addRow([]);
    let div = worksheet.addRow([division])
    div.alignment = {
      horizontal: 'center',
      size: 16, 
      bold: true
    }
    worksheet.mergeCells('A4:G4');
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    worksheet.addRow([]);
    //Add Header Row
    let headerRow = worksheet.addRow(tableHeader);
    
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'ReportSummary'){
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.Name);
        vals.push(this.datePipe.transform(+item.ExpectedStartTime*1000, 'MMM d, y HH:mm'));
        if (item.DeviceStartKm <= 0) {
          vals.push('--')
        } else {
          vals.push(this.datePipe.transform(+item.DeviceStartTime*1000, 'MMM d, y HH:mm'));
        }
        vals.push(this.datePipe.transform(+item.ExpectedEndTime*1000, 'MMM d, y HH:mm'));
        if (item.DeviceEndKm <= 0) {
          vals.push('--')
        } else {
          vals.push(this.datePipe.transform(+item.DeviceEndTime*1000, 'MMM d, y HH:mm'));
        }
        vals.push(item.ExpectedStartKm);
        // vals.push(item.DeviceStartKm);
        if (item.LocationCount == 0 && item.DeviceStartKm) {
          vals.push('--')
        } else {
          vals.push(item.DeviceStartKm);
        }
        vals.push(item.ExpectedEndKm);
        if (item.LocationCount == 0 && item.DeviceStartKm) {
          vals.push('--')
        } else {
          vals.push(item.DeviceEndKm);
        }
        vals.push(item.MaxSpeed);
        vals.push(item.AvgSpeed);
        worksheet.addRow(vals);
        i++;
      })
    }
    
    if(reportName == 'ReportSummary'){
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 30;
      
    }

    this.saveFile(workbook,FileName)
  

  }

  generatePatrolmanReportSummaryExcel(reportName,data: Array<patrolmanReportInfo>,tableHeader, filterType, division,date){
    //Create workbook and worksheet
    // console.log("data", data)
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = reportName.replace(/_/g, " ")
    let subTitleRow; let titleRow;

    //Add Row and formatting
    if (filterType == ' ' || !filterType) {
      titleRow = worksheet.addRow([reportName  + '(' + 'All' + ')' + '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    } else {
     titleRow = worksheet.addRow([reportName + '(' + filterType + ')' + '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    }
    worksheet.addRow([]);
    let div = worksheet.addRow([division])
    div.alignment = {
      horizontal: 'center',
      size: 16, 
      bold: true
    }
    worksheet.mergeCells('A4:G4');
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    
    //Blank Row 
    // worksheet.addRow([]);
    //Add Header Row
    // let headerRow = worksheet.addRow(tableHeader);
    let headerRow =  worksheet.addRow(['Sr.No', 'Name','Allocated Beat','Allocated Start Time', 'Actual Start Time', 'Allocated End Time', 'Actual End Time','Allocated KM', 'Actual KM', 'Allocated Trip', 'Actual Trip','Max Speed', 'Avg Speed', 'Remarks','']);
    
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    if(reportName == 'Patrolman_Report_Summary'){
      data.forEach(item =>{
        let vals=[];
        vals.push(i);
        vals.push(item.Name);
        vals.push(item.AllocatedBeat);
        vals.push(this.datePipe.transform(+item.ExpectedStartTime*1000, 'MMM d, y HH:mm'));
        if (item.DeviceStartTime <= 0) {
          vals.push('--')
        } else {
          vals.push(this.datePipe.transform(+item.DeviceStartTime*1000, 'MMM d, y HH:mm'));
        }
        vals.push(this.datePipe.transform(+item.ExpectedEndTime*1000, 'MMM d, y HH:mm'));
        if (item.DeviceEndTime <= 0) {
          vals.push('--')
        } else {
          vals.push(this.datePipe.transform(+item.DeviceEndTime*1000, 'MMM d, y HH:mm'));
        }
        vals.push(+item.ExpectedKmCover);
        vals.push(+item.ActualKmCover);
        vals.push(+item.AllocatedTrip);
        vals.push(+item.ActualTrip);
        vals.push(+item.MaxSpeed);
        vals.push(+item.AvgSpeed);
        vals.push(item.Remark);

        worksheet.addRow(vals);
        i++;
      })
    }

    
    if(reportName == 'Patrolman_Report_Summary'){
      worksheet.getColumn(1).width = 10;
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(14).width = 60;
    }
    this.saveFile(workbook,FileName)
  }

  patrolmenData: any;
  generatePatrolmanReportSummaryExcelDetail(reportName,data: Array<patrolmanReportInfo>,tableHeader, filterType, division,date){
    //Create workbook and worksheet
    // console.log("data", data)
    this.patrolmenData = data;
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report');
    //setFileName
    let FileName = 'Patrolmen Detail Report'
    let subTitleRow; let titleRow;

    //Add Row and formatting
    if (filterType == ' ' || !filterType) {
      titleRow = worksheet.addRow([reportName  + '(' + 'All' + ')' + '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    } else {
     titleRow = worksheet.addRow([reportName + '(' + filterType + ')' + '-' +'Date:'  + this.datePipe.transform(date*1000, 'mediumDate')]);
    }
    worksheet.addRow([]);
    let div = worksheet.addRow([division])
    div.alignment = {
      horizontal: 'center',
      size: 16, 
      bold: true
    }
    worksheet.mergeCells('A4:G4');
    worksheet.addRow([]);
    subTitleRow = worksheet.addRow([]);
    const row = worksheet.getRow(5);
    let headerRow =  worksheet.addRow(['Sr.No', 'Name','Remarks','Allocated Start Time', 'Actual Start Time', 'Allocated End Time', 'Actual End Time','Allocated KM', 'Actual KM', 'Allocated Trip', 'Actual Trip','Avg Speed']);
  
    //set style to file
    this.applyStyle(titleRow,subTitleRow,workbook,worksheet,headerRow,reportName)
    let i=1;
    let j = 0;
   
    data.forEach(item =>{ 
      worksheet.addRow([]);  
      let vals=[];
        vals.push(i);
          vals.push(item.Name);
          vals.push(item.Remark);
          // vals.push(item.AllocatedBeat);
          vals.push(this.datePipe.transform(+item.ExpectedStartTime*1000, 'MMM d, y HH:mm'));
          if (item.DeviceStartTime <= 0) {
            vals.push('--')
          } else {
            vals.push(this.datePipe.transform(+item.DeviceStartTime*1000, 'MMM d, y HH:mm'));
          }
          vals.push(this.datePipe.transform(+item.ExpectedEndTime*1000, 'MMM d, y HH:mm'));
          if (item.DeviceEndTime <= 0) {
            vals.push('--')
          } else {
            vals.push(this.datePipe.transform(+item.DeviceEndTime*1000, 'MMM d, y HH:mm'));
          }
          vals.push(+item.ExpectedKmCover);
          vals.push(+item.ActualKmCover);
          vals.push(+item.AllocatedTrip);
          vals.push(+item.ActualTrip);
          // vals.push(+item.MaxSpeed);
          vals.push(+item.AvgSpeed);

          let firstRow = worksheet.addRow(vals);
          firstRow.eachCell((cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00CED1' },
              bgColor: { argb: '00CED1' }
            } 
            cell.alignment = {
              horizontal: 'center',
              verticle: 'center'
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })

          let subHeader = worksheet.addRow(['Trips', 'Device Start Time','Expected Start Time','Device Start Km', 'Expected Start Km', 'Device End Time', 'Expected End Time','Device End Km', 'Expected End Km', 'Actual Km Cover', 'Max Speed'])
          subHeader.eachCell((cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' },
              bgColor: { argb: 'FF0000FF' }
            }
            cell.alignment = {
              horizontal: 'center',
              verticle: 'center'
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })

          // trip 1
            let valDetails = []
            if (item.deviceDetailTripList[0]) {
              valDetails.push('Trip-1')
              if (item.deviceDetailTripList[0].DeviceStartTime <= 0) {
                valDetails.push('--')
              } else {
                valDetails.push(this.datePipe.transform(+item.deviceDetailTripList[0].DeviceStartTime*1000, 'MMM d, y HH:mm'));
              }
              valDetails.push(this.datePipe.transform(+item.deviceDetailTripList[0].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
              if (item.deviceDetailTripList[0].DeviceStartKm <= 0) {
                valDetails.push('--')
              } else {
                valDetails.push(item.deviceDetailTripList[0].DeviceStartKm);
              }
              valDetails.push(+item.deviceDetailTripList[0].ExpectedStartKm);
              if (item.deviceDetailTripList[0].DeviceEndTime <= 0) {
                valDetails.push('--')
              } else {
                valDetails.push(this.datePipe.transform(+item.deviceDetailTripList[0].DeviceEndTime*1000, 'MMM d, y HH:mm'));
              }
              valDetails.push(this.datePipe.transform(+item.deviceDetailTripList[0].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              if (item.deviceDetailTripList[0].DeviceEndKm <= 0) {
                valDetails.push('--')
              } else {
                valDetails.push(+item.deviceDetailTripList[0].DeviceEndKm);
              }
              valDetails.push(+item.deviceDetailTripList[0].ExpectedEndKm);
              valDetails.push(+item.deviceDetailTripList[0].ActualKmCover);
              valDetails.push(+item.deviceDetailTripList[0].MaxSpeed);
              let trip1 = worksheet.addRow(valDetails);
              trip1.eachCell((cell, number) => {
                cell.alignment = {
                  horizontal: 'center',
                  verticle: 'center'
                }
              })
            }
           

            // trip 2
              let valDetails1 = []
              if (item.deviceDetailTripList[1]) {
                valDetails1.push('Trip-2')
                if (item.deviceDetailTripList[1].DeviceStartTime <= 0) {
                  valDetails1.push('--')
                } else {
                  valDetails1.push(this.datePipe.transform(+item.deviceDetailTripList[1].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails1.push(this.datePipe.transform(+item.deviceDetailTripList[1].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails1.push(item.deviceDetailTripList[1].DeviceStartKm);
                if (item.deviceDetailTripList[1].DeviceStartKm <= 0) {
                  valDetails1.push('--')
                } else {
                  valDetails1.push(item.deviceDetailTripList[1].DeviceStartKm);
                }
                valDetails1.push(+item.deviceDetailTripList[1].ExpectedStartKm);
                if (item.deviceDetailTripList[1].DeviceEndTime <= 0) {
                  valDetails1.push('--')
                } else {
                  valDetails1.push(this.datePipe.transform(+item.deviceDetailTripList[1].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails1.push(this.datePipe.transform(+item.deviceDetailTripList[1].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails1.push(+item.deviceDetailTripList[1].DeviceEndKm);
                if (item.deviceDetailTripList[1].DeviceEndKm <= 0) {
                  valDetails1.push('--')
                } else {
                  valDetails1.push(+item.deviceDetailTripList[1].DeviceEndKm);
                }
                valDetails1.push(+item.deviceDetailTripList[1].ExpectedEndKm);
                valDetails1.push(+item.deviceDetailTripList[1].ActualKmCover);
                valDetails1.push(+item.deviceDetailTripList[1].MaxSpeed);
                let trip2 = worksheet.addRow(valDetails1);
                trip2.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 3
              let valDetails2 = []
              if (item.deviceDetailTripList[2]) {
                valDetails2.push('Trip-3')
                if (item.deviceDetailTripList[2].DeviceStartTime <= 0) {
                  valDetails2.push('--')
                } else {
                  valDetails2.push(this.datePipe.transform(+item.deviceDetailTripList[2].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails2.push(this.datePipe.transform(+item.deviceDetailTripList[2].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails2.push(item.deviceDetailTripList[2].DeviceStartKm);
                if (item.deviceDetailTripList[2].DeviceStartKm <= 0) {
                  valDetails2.push('--')
                } else {
                  valDetails2.push(item.deviceDetailTripList[2].DeviceStartKm);
                }
                valDetails2.push(+item.deviceDetailTripList[2].ExpectedStartKm);
                if (item.deviceDetailTripList[2].DeviceEndTime <= 0) {
                  valDetails2.push('--')
                } else {
                  valDetails2.push(this.datePipe.transform(+item.deviceDetailTripList[2].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails2.push(this.datePipe.transform(+item.deviceDetailTripList[2].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails2.push(+item.deviceDetailTripList[2].DeviceEndKm);
                if (item.deviceDetailTripList[2].DeviceEndKm <= 0) {
                  valDetails2.push('--')
                } else {
                  valDetails2.push(+item.deviceDetailTripList[2].DeviceEndKm);
                }
                valDetails2.push(+item.deviceDetailTripList[2].ExpectedEndKm);
                valDetails2.push(+item.deviceDetailTripList[2].ActualKmCover);
                valDetails2.push(+item.deviceDetailTripList[2].MaxSpeed);
                let trip3 = worksheet.addRow(valDetails2);
                trip3.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 4
              let valDetails3 = []
              if (item.deviceDetailTripList[3]) {
                valDetails3.push('Trip-4')
                if (item.deviceDetailTripList[3].DeviceStartTime <= 0) {
                  valDetails3.push('--')
                } else {
                  valDetails3.push(this.datePipe.transform(+item.deviceDetailTripList[3].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails3.push(this.datePipe.transform(+item.deviceDetailTripList[3].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails3.push(item.deviceDetailTripList[3].DeviceStartKm);
                if (item.deviceDetailTripList[3].DeviceStartKm <= 0) {
                  valDetails3.push('--')
                } else {
                  valDetails3.push(item.deviceDetailTripList[3].DeviceStartKm);
                }
                valDetails3.push(+item.deviceDetailTripList[3].ExpectedStartKm);
                if (item.deviceDetailTripList[3].DeviceEndTime <= 0) {
                  valDetails3.push('--')
                } else {
                  valDetails3.push(this.datePipe.transform(+item.deviceDetailTripList[3].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails3.push(this.datePipe.transform(+item.deviceDetailTripList[3].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails3.push(+item.deviceDetailTripList[3].DeviceEndKm);
                if (item.deviceDetailTripList[3].DeviceEndKm <= 0) {
                  valDetails3.push('--')
                } else {
                  valDetails3.push(+item.deviceDetailTripList[3].DeviceEndKm);
                }
                valDetails3.push(+item.deviceDetailTripList[3].ExpectedEndKm);
                valDetails3.push(+item.deviceDetailTripList[3].ActualKmCover);
                valDetails3.push(+item.deviceDetailTripList[3].MaxSpeed);
                let trip4 = worksheet.addRow(valDetails3);
                trip4.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 5
              let valDetails4 = []
              if (item.deviceDetailTripList[4]) {
                valDetails4.push('Trip-5')
                if (item.deviceDetailTripList[4].DeviceStartTime <= 0) {
                  valDetails4.push('--')
                } else {
                  valDetails4.push(this.datePipe.transform(+item.deviceDetailTripList[4].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails4.push(this.datePipe.transform(+item.deviceDetailTripList[4].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails4.push(item.deviceDetailTripList[4].DeviceStartKm);
                if (item.deviceDetailTripList[4].DeviceStartKm <= 0) {
                  valDetails4.push('--')
                } else {
                  valDetails4.push(item.deviceDetailTripList[4].DeviceStartKm);
                }
                valDetails4.push(+item.deviceDetailTripList[4].ExpectedStartKm);
                if (item.deviceDetailTripList[4].DeviceEndTime <= 0) {
                  valDetails4.push('--')
                } else {
                  valDetails4.push(this.datePipe.transform(+item.deviceDetailTripList[4].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails4.push(this.datePipe.transform(+item.deviceDetailTripList[4].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails4.push(+item.deviceDetailTripList[4].DeviceEndKm);
                if (item.deviceDetailTripList[4].DeviceEndKm <= 0) {
                  valDetails4.push('--')
                } else {
                  valDetails4.push(+item.deviceDetailTripList[4].DeviceEndKm);
                }
                valDetails4.push(+item.deviceDetailTripList[4].ExpectedEndKm);
                valDetails4.push(+item.deviceDetailTripList[4].ActualKmCover);
                valDetails4.push(+item.deviceDetailTripList[4].MaxSpeed);
                let trip5 = worksheet.addRow(valDetails4);
                trip5.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 6
              let valDetails5 = []
              if (item.deviceDetailTripList[5]) {
                valDetails5.push('Trip-6')
                if (item.deviceDetailTripList[5].DeviceStartTime <= 0) {
                  valDetails5.push('--')
                } else {
                  valDetails5.push(this.datePipe.transform(+item.deviceDetailTripList[5].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails5.push(this.datePipe.transform(+item.deviceDetailTripList[5].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails5.push(item.deviceDetailTripList[5].DeviceStartKm);
                if (item.deviceDetailTripList[5].DeviceStartKm <= 0) {
                  valDetails5.push('--')
                } else {
                  valDetails5.push(item.deviceDetailTripList[5].DeviceStartKm);
                }
                valDetails5.push(+item.deviceDetailTripList[5].ExpectedStartKm);
                if (item.deviceDetailTripList[5].DeviceEndTime <= 0) {
                  valDetails5.push('--')
                } else {
                  valDetails5.push(this.datePipe.transform(+item.deviceDetailTripList[5].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails5.push(this.datePipe.transform(+item.deviceDetailTripList[5].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails5.push(+item.deviceDetailTripList[5].DeviceEndKm);
                if (item.deviceDetailTripList[5].DeviceEndKm <= 0) {
                  valDetails5.push('--')
                } else {
                  valDetails5.push(+item.deviceDetailTripList[5].DeviceEndKm);
                }
                valDetails5.push(+item.deviceDetailTripList[5].ExpectedEndKm);
                valDetails5.push(+item.deviceDetailTripList[5].ActualKmCover);
                valDetails5.push(+item.deviceDetailTripList[5].MaxSpeed);
                let trip6 = worksheet.addRow(valDetails5);
                trip6.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 7
              let valDetails6 = []
              if (item.deviceDetailTripList[6]) {
                valDetails6.push('Trip-7')
                if (item.deviceDetailTripList[6].DeviceStartTime <= 0) {
                  valDetails6.push('--')
                } else {
                  valDetails6.push(this.datePipe.transform(+item.deviceDetailTripList[6].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails6.push(this.datePipe.transform(+item.deviceDetailTripList[6].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails6.push(item.deviceDetailTripList[6].DeviceStartKm);
                if (item.deviceDetailTripList[6].DeviceStartKm <= 0) {
                  valDetails6.push('--')
                } else {
                  valDetails6.push(item.deviceDetailTripList[6].DeviceStartKm);
                }
                valDetails6.push(+item.deviceDetailTripList[6].ExpectedStartKm);
                if (item.deviceDetailTripList[6].DeviceEndTime <= 0) {
                  valDetails6.push('--')
                } else {
                  valDetails6.push(this.datePipe.transform(+item.deviceDetailTripList[6].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails6.push(this.datePipe.transform(+item.deviceDetailTripList[6].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails6.push(+item.deviceDetailTripList[6].DeviceEndKm);
                if (item.deviceDetailTripList[6].DeviceEndKm <= 0) {
                  valDetails6.push('--')
                } else {
                  valDetails6.push(+item.deviceDetailTripList[6].DeviceEndKm);
                }
                valDetails6.push(+item.deviceDetailTripList[6].ExpectedEndKm);
                valDetails6.push(+item.deviceDetailTripList[6].ActualKmCover);
                valDetails6.push(+item.deviceDetailTripList[6].MaxSpeed);
                let trip7 = worksheet.addRow(valDetails6);
                trip7.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }

              // trip 8
              let valDetails7 = []
              if (item.deviceDetailTripList[7]) { 
                valDetails7.push('Trip-8')
                if (item.deviceDetailTripList[7].DeviceStartTime <= 0) {
                  valDetails7.push('--')
                } else {
                  valDetails7.push(this.datePipe.transform(+item.deviceDetailTripList[7].DeviceStartTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails7.push(this.datePipe.transform(+item.deviceDetailTripList[7].ExpectedStartTime*1000, 'MMM d, y HH:mm'));
                // valDetails7.push(item.deviceDetailTripList[7].DeviceStartKm);
                if (item.deviceDetailTripList[7].DeviceStartKm <= 0) {
                  valDetails7.push('--')
                } else {
                  valDetails7.push(item.deviceDetailTripList[7].DeviceStartKm);
                }
                valDetails7.push(+item.deviceDetailTripList[7].ExpectedStartKm);
                if (item.deviceDetailTripList[7].DeviceEndTime <= 0) {
                  valDetails7.push('--')
                } else {
                  valDetails7.push(this.datePipe.transform(+item.deviceDetailTripList[7].DeviceEndTime*1000, 'MMM d, y HH:mm'));
                }
                valDetails7.push(this.datePipe.transform(+item.deviceDetailTripList[7].ExpectedEndTime*1000, 'MMM d, y HH:mm'));
              
                // valDetails7.push(+item.deviceDetailTripList[7].DeviceEndKm);
                if (item.deviceDetailTripList[7].DeviceEndKm <= 0) {
                  valDetails7.push('--')
                } else {
                  valDetails7.push(+item.deviceDetailTripList[7].DeviceEndKm);
                }
                valDetails7.push(+item.deviceDetailTripList[7].ExpectedEndKm);
                valDetails7.push(+item.deviceDetailTripList[7].ActualKmCover);
                valDetails7.push(+item.deviceDetailTripList[7].MaxSpeed);
                let trip8 = worksheet.addRow(valDetails7);
                trip8.eachCell((cell, number) => {
                  cell.alignment = {
                    horizontal: 'center',
                    verticle: 'center'
                  }
                })
              }
            i++;
          })

        if(reportName == 'Patrolman_Report_Summary'){
            worksheet.getColumn(1).width = 10;
            worksheet.getColumn(2).width = 30;
            worksheet.getColumn(3).width = 50;
            worksheet.getColumn(4).width = 20
            worksheet.getColumn(5).width = 20
            worksheet.getColumn(6).width = 20
            worksheet.getColumn(7).width = 20
            worksheet.getColumn(8).width = 20
            worksheet.getColumn(9).width = 20
            worksheet.getColumn(10).width = 20
            worksheet.getColumn(11).width = 20
            worksheet.getColumn(12).width = 10
            worksheet.getColumn(13).width = 10
            worksheet.getColumn(14).width = 10;
        }
        this.saveFile(workbook,FileName)
  }





  saveFile(workbook,fileName){
     //Generate Excel File with given name
     workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName+'.xlsx');
    })
  }

}
