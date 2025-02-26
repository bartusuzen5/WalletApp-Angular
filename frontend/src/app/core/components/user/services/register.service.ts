import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../../shared/services/generic-http.service';
import { Observable } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private _http: GenericHttpService
  ){}

  public addUser(registerUser: RegisterModel): Observable<any>{
    return this._http.post<any>('user/register/add', registerUser)
  };

  public updateUser(updateUser: UserModel): Observable<any>{
    return this._http.put<any>(`user/register/updateUser/${updateUser._id}`, updateUser)
  }

  public updateUserPassword(oldPassword: string, newPassword: string, updateUser: UserModel): Observable<any>{
    return this._http.put<any>(`user/register/updatePassword/${updateUser._id}`, {oldPassword, newPassword})
  }
}
