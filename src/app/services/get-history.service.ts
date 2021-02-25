import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { retryWhen, mergeMap } from 'rxjs/operators';
import { interval, throwError, of } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class GetHistoryService {

  constructor(private http: HttpClient,
              private logServ: LoginService
              ) { }

  localApi : any = 'http://123.252.246.214:8080/TrackingAppDB/TrackingAPP/'
  getTrackHistory(startDt, endDt, imei_no){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('Imei_no', imei_no)
    .set('StartDateTime', startDt)
    .set('EndDateTime', endDt)
      
    // post these details to API, server will return tracking history information
    // return this.http.post(this.localApi+ 'UserServiceAPI/GetHistoryInfo', params, options)
    return this.http.post(this.logServ.apiUrl+'UserServiceAPI/GetHistoryInfo', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getBatteryInfo(startDt, endDt, imei_no){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('imeiNo', imei_no)
    .set('StartDateTime', startDt)
    .set('EndDateTime', endDt)
    return this.http.post(this.logServ.apiUrl + 'UserServiceAPI/GetBatteryStatusInfo', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }

  getBeatInfoOfDevices(stdId){
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    let params = new HttpParams()
    .set('studentId', stdId)
   
    return this.http.post(this.logServ.apiUrl + 'UserServiceAPI/GetDeviceBeat', params, options)
    .pipe(
      //retry upto 3 times after getting error from server
      retryWhen((error:any) => {
        return interval(5000).pipe(
         mergeMap(count => count == 3 ? throwError("Giving up") : of(count))
        )}
      )
    )
  }
}
