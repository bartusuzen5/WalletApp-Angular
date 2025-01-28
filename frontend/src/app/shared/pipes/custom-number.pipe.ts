import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customNumber',
  standalone: true
})
export class CustomNumberPipe implements PipeTransform {

  transform(value: any): string {
    if(typeof value === 'number'){
      let formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);

      formattedValue = formattedValue.replace(/\./g, '#').replace(/,/g, '.').replace(/#/g, ',');
      return formattedValue
    } else {
      return value?.toString();
    }
  }

}
