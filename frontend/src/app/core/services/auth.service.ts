import { Injectable } from '@angular/core';
import { UserModel } from '../components/user/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getToken(): string | null{
    return localStorage.getItem('token')
  };

  getUser(): UserModel | null{
    const userData = localStorage.getItem('user')
    if (!userData) return null
    try{
      const user = JSON.parse(userData);
      return new UserModel(user);
    } catch(error){
      return null
    }
    };

  getUserRole(): string | null{
    const token = this.getToken()
    if(!token) return null
    try{
      const tokenPayload = JSON.parse(atob(token.split('.')[1]))
      return tokenPayload.role
    }catch {
      return null
    }
  }
}
