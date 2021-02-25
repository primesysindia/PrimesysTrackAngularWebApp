import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'patrolmanFilter'
})
export class PatrolmanFilterPipe implements PipeTransform {

  transform(items: any, filterType: any): any {
    //  console.log(filterType)
    if(!filterType)
    {
      return items;
    }
    else{
      if(filterType == "Device Off"){
      return items.filter(value =>value.Remark == 'Device was Off.');
      }
      // else if(filterType == "OverSpeed") {
      //   return items.filter(value =>value.DeviceOvespeedCount > 5);
      // }
      else if(filterType == "Beat Not Covered") {
        return items.filter(value =>value.AllocatedTrip - value.ActualTrip > 0 && value.Remark != 'Device was Off.');
      }
      else if(filterType == "Distance Covered Successfully") {
        return items.filter(value =>value.Remark == 'All work done succesfully');
      }
      // else if(filterType == "Trip Not Schedule") {
      //   return items.filter(value =>value.ExpectedStartKm - value.ExpectedEndKm == -1);
      // }
      else if(filterType == "Late On Track") {
        return items.filter(value =>value.StartTimeDiff > 900);
      }
      else if(filterType == "Early Off Track") {
        return items.filter(value =>value.EndTimeDiff > 900);
      }
      else{ 
        return items;
      }
  }
  }

}
