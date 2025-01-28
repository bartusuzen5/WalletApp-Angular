import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAllCategory(): Observable<any[]>{
    return this._http.get<any[]>("wallet/category")
  }

  public getAssetsByCategory(categoryId: string): Observable<any[]>{
    let model = {categoryId: categoryId}
    return this._http.post<any[]>("wallet/asset", model)
  }


}
