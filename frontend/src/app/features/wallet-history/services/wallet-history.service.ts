import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletHistoryService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(userId: string): Observable<any[]>{
    return this._http.get<any[]>(`wallet-history/${userId}`)
  }
}
