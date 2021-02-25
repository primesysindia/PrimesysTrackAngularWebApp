import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFileName'
})
export class SearchFileNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    else{
    return value.filter((val) => {
      let rVal = ( val.fileName.toLowerCase().includes(args) || val.fileName.includes(args) == true);
     
      return rVal;
    })
  }

  }
}
