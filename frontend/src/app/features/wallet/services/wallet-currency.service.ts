import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { WalletUserCurrencyModel } from '../models/wallet-user-currency';

@Injectable({
  providedIn: 'root'
})
export class WalletCurrencyService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(userId: string): Observable<WalletUserCurrencyModel[]>{
    return this._http.get<WalletUserCurrencyModel[]>(`wallet-currency/${userId}`)
  }

  public add(walletUserCurrency: WalletUserCurrencyModel): Observable<any>{
    return this._http.post<any>("wallet-currency/add", walletUserCurrency)
  }

  public update(walletUserCurrency: WalletUserCurrencyModel): Observable<any>{
    return this._http.put<any>(`wallet-currency/update/${walletUserCurrency._id}`, walletUserCurrency)
  }
}
