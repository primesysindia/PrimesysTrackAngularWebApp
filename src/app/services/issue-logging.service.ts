import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { Observable, interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class IssueLoggingService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/';

  constructor(private http: HttpClient, private logServ: LoginService) { }

  GetIssueList () {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('userLoginId', userLoginId)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueMasetrList', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  GetDeviceInfoAndIssue (std_id, imei_no) {
    let params = new HttpParams()
    .set('studentId', std_id)
    .set('imeiNo', imei_no)
    // console.log("params", params)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetDeviceInfo', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  saveIssue(data: any) {
    let parentId = JSON.parse(localStorage.getItem('ParentId'))
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;

    let params = new HttpParams()
    .set('parentId', userLoginId)
    .set('userLoginId', userLoginId)
    .set('studentId', data.student_id)
    .set('isseMasterId', data.issue)
    .set('contactPerson', data.caller_name)
    .set('contactPersonMobNo', data.contact)
    .set('issueStatus', '1')
    .set('priority', '2')
    .set('issueComment', data.description)
    .set('isBatteryOn', '0')
    .set('isDeviceOn', '0')
    .set('isImeiSIMCorrect', '0')
    .set('isGSMOn', '0')
    .set('isDeviceButtonOn', '0')
    .set('isGpsOn', '0')
    .set('fileList', '0')
    // console.log("params", params)

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveDeviceIssue', params, options)
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getAllIssueHistory() {
    var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
    var userLoginId = userInfo.usrId;
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

     let params = new HttpParams()
    .set('studentId', '0')
    .set('issueId', '0')
    .set('userLoginId', userLoginId)
    .set('startTime', '0')
    .set('endTime','0')
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetIssueDetails', params, options) 
    // console.log("res", res)
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

}
