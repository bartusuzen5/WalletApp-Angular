import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { WalletHistoryAddModel } from '../models/wallet-history-add';

@Injectable({
  providedIn: 'root'
})
export class HistoryAddService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public add(walletHistory: WalletHistoryAddModel): Observable<any>{
    return this._http.post<any>("wallet-history/add", walletHistory)
  }
}