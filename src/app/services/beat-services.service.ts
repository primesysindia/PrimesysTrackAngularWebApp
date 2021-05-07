import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class BeatServicesService {
  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/';

  constructor(private http: HttpClient, private logServ: LoginService) { }

  saveKeymenBeats (data: any) {
    var daata = JSON.parse(data);
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('KeymanBeatData',JSON.stringify(daata))
    // console.log(params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/SaveKeymanBeatInBulk', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getKeymanExistingBeatByParent(parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl+ 'AdminDashboardServiceApi/GetKeymanExistingBeatByParent', params, options)
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

  getApprovedKeymenBeats (parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeatToApproveByParent', params, options)
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

  savePatrolmenBeats (data: any) {
    var data = JSON.parse(data);
    console.log("data", data)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('parentId', data.parentId)
    .set('name', data.name)
    .set('userLoginId', data.userLoginId)
    .set('contactNo', data.contactNo)
    .set('seasonId', data.seasonId)
    .set('emailId', data.contactNo)
    .set('patrolmenFormArray', JSON.stringify(data.patrolmenFormArray))
    // console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/AddPatrolmanBeatBulk', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }


  getPatrolmenBeatByStdId (stdId, seasonId) {
    // var data = JSON.parse(data);
    // console.log("data", data)
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams()
    .set('StudentId', stdId)
    .set('SeasonId', seasonId)
    // console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetPatrolMenBeatAPI', params, options) 
    return res .pipe(
      //retry upto 3 times after getting error from serve
      retryWhen((error:any) => {
        return interval(5000).pipe(
          mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    ) 
  }

  getPatrolmenExistingBeatByParent(parId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    .set('seasonId', '1')
    console.log("params", params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetPatrolmanExistingBeatToApproveByParent', params, options)
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

  getKeymenExistingBeat(parId, stdId) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
     let params = new HttpParams()
    .set('parentId', parId)
    .set('studentId', stdId)
    .set('beatId', '0')
    .set('userLoginId', parId)

    // console.log("params", params)
    var res = this.http.post(this.logServ.apiUrl + 'AdminDashboardServiceApi/GetKeymanExistingBeat', params, options)
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
  
  // get railway department hierarchy api
  GetRailwayDepHierarchy (pId) {
   var userInfo = JSON.parse(localStorage.getItem('currentUserInfo'));
   var userLoginId = userInfo.usrId;
 
   let options = {
     headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
   };
 
    let params = new HttpParams()
   .set('parentId', pId)
   .set('hirachyParentId', '0')
   .set('userLoginId', userLoginId)
   // console.log("params", params)
   var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetRailwayDeptHierarchy', params, options) 
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



// http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/AdminDashboardServiceApi/GetPatrolMenBeatAPI 