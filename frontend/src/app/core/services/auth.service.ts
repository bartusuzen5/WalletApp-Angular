import { Injectable } from '@angular/core';
import { UserModel } from '../components/user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: UserModel | null = null

  constructor() {
    this.loadUserFromToken()
  }

  getToken(): string | null{
    return localStorage.getItem('token')
  };

  loadUserFromToken(){
    const token = this.getToken()
    if (!token) return;
    try{
      const tokenPayload = JSON.parse(this.base64DecodeUnicode(token.split('.')[1]));
      this.user = new UserModel({
        _id: tokenPayload._id,
        name: tokenPayload.name,
        surname: tokenPayload.surname,
        email: tokenPayload.email,
        role: tokenPayload.role
      })
    } catch(error){
      this.user = null
    }
  };

  getUser(): UserModel | null {
    return this.user;
  };

  getUserRole(): string | null{
    return this.user.role
  };

  private base64DecodeUnicode(str: string) {
    return decodeURIComponent(escape(atob(str)));
  }
}
