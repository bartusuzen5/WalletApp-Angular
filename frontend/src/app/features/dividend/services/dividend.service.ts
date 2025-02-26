import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { DividendModel } from '../models/dividend.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DividendService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(userId: string): Observable<DividendModel[]>{
    return this._http.get<DividendModel[]>(`dividend/${userId}`);
  }

  public add(userId: string, dividend: DividendModel): Observable<any>{
    return this._http.post<any>(`dividend/add/${userId}`, dividend)
  }

  public update(dividend: DividendModel): Observable<any>{
    return this._http.put<any>(`dividend/update/${dividend._id}`, dividend);
  }

  public removeById(dividendId: string): Observable<any>{
    return this._http.delete<any>("dividend/removeById", dividendId)
  }
}
