import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { LoginResponseModel } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getUser(user: LoginModel): Observable<LoginResponseModel>{
    return this._http.post<LoginResponseModel>("user/login", user)
  }

}
