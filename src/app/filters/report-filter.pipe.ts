import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportFilter'
})
export class ReportFilterPipe implements PipeTransform {
  filterResult1: any;
  transform(items: any, filterType: string): any {
    if(!filterType)
    {
      return items;
    }
    else{
      if(filterType == "Device Off"){
      return items.filter(value =>value.LocationCount == 0);
      }
      else if(filterType == "OverSpeed") {
        return items.filter(value =>value.DeviceOvespeedCount > 5);
      }
      else if(filterType == "KM Not Covered") {
        return items.filter(value =>value.ExpectedKmCover - value.ActualKmCover > 0.5 && value.LocationCount > 0);
      }
      else if(filterType == "Distance Covered Successfully") {
        return items.filter(value =>value.ExpectedKmCover - value.ActualKmCover <= 0.5);
      }
      else if(filterType == "Trip Not Schedule") {
        return items.filter(value =>value.ExpectedStartKm - value.ExpectedEndKm == -1);
      }
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
