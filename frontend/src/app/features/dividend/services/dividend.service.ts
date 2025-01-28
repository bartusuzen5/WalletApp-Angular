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

  getAll(): Observable<DividendModel[]>{
    return this._http.get<DividendModel[]>("dividend");
  }

  add(model: DividendModel): Observable<any>{
    return this._http.post<any>("dividend/add", model)
  }

  update(model: DividendModel): Observable<any>{
    return this._http.post<any>("dividend/update", model);
  }

  removeById(model: DividendModel): Observable<any>{
    return this._http.post<any>("dividend/removeById", model)
  }
}
