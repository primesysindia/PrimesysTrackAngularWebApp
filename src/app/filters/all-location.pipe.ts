import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allLocation'
})
export class AllLocationPipe implements PipeTransform {

  

  transform(items: any, sortType: string): any {
    let userType = localStorage.getItem('userType')
    if(!sortType)
    {
      return items;
    }
    else{
      if(sortType == 'all'){
        return items
      }
      else if(sortType == 'currentOn'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('darkGreen-marker') == true
          })
        else
          return items.filter(value => {
            return value.icon.includes('GreenCar') == true
          })
      }
      else if(sortType == 'todayOn'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('orange-marker') == true
          })
        else
          return items.filter(value => {
            return value.icon.includes('RedCar') == true
          })
      }
      else if(sortType == 'todayOff'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('red-marker') == true
          })
        else
          return items.filter(value => {
            return value.icon.includes('RedCar') == true
          })
      }
      else if(sortType == 'pastOff'){
        if(userType == 'Child')
          return items.filter(value => {
            return value.icon.includes('gray-marker') == true
          })
      }
      else if(sortType == 'stoppage'){
        return items.filter(value =>{
          return value.icon.includes('BlueCar') == true
        })
      }
      else{
        return items;
      }
    }
  }

}
