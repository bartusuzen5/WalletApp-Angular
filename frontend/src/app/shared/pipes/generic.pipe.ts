import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs';
import { GenericUtils } from '../utilities/generic.utils';

@Pipe({
  name: 'genericNameFilter',
  standalone: true
})
export class GenericPipe implements PipeTransform {

  transform(value: any[], filters: { [key: string]: string }, sortColumn: string = '', sortOrder: 'asc' | 'desc' = 'asc', nullColumns: string[] = []): any[] {
    if (!value) return []
    let filteredItems = value.filter((item) => {

      const hasNullValue = nullColumns.some((key) => {
        const columnValue = GenericUtils.getNestedValue(item, key)
        return columnValue === null || columnValue === undefined
      })
      if (hasNullValue) return false

      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        const value = GenericUtils.getNestedValue(item, key)?.toString().toLowerCase() || '';
        return value.includes(filters[key].toString().toLowerCase())
      })
    })

    if (sortColumn){
      filteredItems.sort((a, b) => {
        const valueA = GenericUtils.getNestedValue(a, sortColumn) ?? '';
        const valueB = GenericUtils.getNestedValue(b, sortColumn) ?? '';
        if (valueA === null || valueB === null) return 0;
        if (sortOrder === 'asc'){
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      })
    }

    return filteredItems
  }
}

