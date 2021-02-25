import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serachNameRemark'
})
export class SerachNameRemarkPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    else{
    return value.filter((val) => {
      let rVal = (val.Remark.toLowerCase().includes(args) || val.Name.toLowerCase().includes(args) || val.Name.includes(args) == true || val.Remark.includes(args) == true);
     
      return rVal;
    })
  }


  }

}
