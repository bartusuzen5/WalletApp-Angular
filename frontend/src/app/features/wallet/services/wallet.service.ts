import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { WalletCategoryModel } from '../models/wallet-category';
import { WalletCurrencyModel } from '../models/wallet-currency';
import { WalletAssetModel } from '../models/wallet-asset';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAllCategory(userId: string): Observable<WalletCategoryModel[]>{
    return this._http.get<WalletCategoryModel[]>(`wallet/category/${userId}`)
  }

  public getAllCurrency(userId: string): Observable<WalletCurrencyModel[]>{
    return this._http.get<WalletCurrencyModel[]>(`wallet/currency/${userId}`)
  }

  public getAssetsByCategory(userId: string, categoryId: string): Observable<WalletAssetModel[]>{
    return this._http.post<WalletAssetModel[]>(`wallet/asset/${userId}`, categoryId)
  }


}
