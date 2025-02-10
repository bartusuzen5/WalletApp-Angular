import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public addUser(newUser: any): Observable<any>{
    return this._http.post<any>('user/register/add', newUser)
  };
}
