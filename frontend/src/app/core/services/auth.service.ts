import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getToken(): string | null{
    return localStorage.getItem('token')
  };

  getUserRole(){
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
