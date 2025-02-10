import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private _http: GenericHttpService
  ){}

  public addUser(newUser: RegisterModel): Observable<any>{
    delete newUser.passwordRepeat
    return this._http.post<any>('user/register/add', newUser)
  };
}
