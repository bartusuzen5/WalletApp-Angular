import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { TradeModel } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(userId: string): Observable<TradeModel[]>{
    return this._http.get<TradeModel[]>(`trade/${userId}`)
  }

  public add(userId: string, trade: TradeModel): Observable<any>{
    return this._http.post<any>(`trade/add/${userId}`, trade)
  }

  public update(trade: TradeModel): Observable<any>{
    return this._http.put<any>(`trade/update/${trade._id}`, trade)
  }

  public removeById(tradeId: string): Observable<any>{
    return this._http.delete<any>("trade/removeById", tradeId)
  }
}
