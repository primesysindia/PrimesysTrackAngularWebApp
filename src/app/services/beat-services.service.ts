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
    console.log(params)
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/SaveKeymanBeatInBulk', params, options) 
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
    var res = this.http.post(this.localApi + 'AdminDashboardServiceApi/GetKeymanExistingBeatByParent', params, options)
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
