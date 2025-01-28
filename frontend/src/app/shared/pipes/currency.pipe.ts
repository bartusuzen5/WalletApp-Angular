import { Pipe, PipeTransform } from '@angular/core';
import { AssetModel } from '../../features/asset/models/asset.model';

@Pipe({
  name: 'currency2',
  standalone: true
})
export class Currency2Pipe implements PipeTransform {

  transform(value: any, symbol: any): string {
    if (!value){
      return ''
    }
    return symbol ? `${value} ${symbol}`: `${value} ?`
  }
}
