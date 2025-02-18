import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryAddService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public add(model: any): Observable<any>{
    return this._http.post<any>("wallet-history/add", model)
  }
}