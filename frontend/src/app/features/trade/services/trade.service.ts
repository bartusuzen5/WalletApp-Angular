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

  public getAll(): Observable<TradeModel[]>{
    return this._http.get<TradeModel[]>("trade")
  }

  public add(model: TradeModel): Observable<any>{
    return this._http.post<any>("trade/add", model)
  }

  public update(model: TradeModel): Observable<any>{
    return this._http.post<any>("trade/update", model)
  }

  public removeById(model: TradeModel): Observable<any>{
    return this._http.post<any>("trade/removeById", model)
  }
}
