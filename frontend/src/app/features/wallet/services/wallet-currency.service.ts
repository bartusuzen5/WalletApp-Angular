import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { WalletCurrencyModel } from '../models/wallet-currency';

@Injectable({
  providedIn: 'root'
})
export class WalletCurrencyService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(): Observable<any[]>{
    return this._http.get<any[]>("wallet-currency")
  }

  public add(model: WalletCurrencyModel): Observable<any>{
    return this._http.post<any>("wallet-currency/add", model)
  }
}
