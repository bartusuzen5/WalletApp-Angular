import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';
import { GenericHttpService } from '../../../shared/services/generic-http.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(): Observable<CurrencyModel[]>{
    return this._http.get<CurrencyModel[]>("currency");
  }

  public add(model: CurrencyModel): Observable<any>{
    return this._http.post<any>("currency/add", model);
  }

  public removeById(model: CurrencyModel): Observable<any>{
    let id = {_id: model._id};
    return this._http.post<any>("currency/removeById", id);
  }

  public update(model: CurrencyModel): Observable<any>{
    return this._http.post<any>("currency/update", model);
  }

}


