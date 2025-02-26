import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../user/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  user: UserModel = new UserModel();

  constructor(
    private _router: Router,
    private _auth: AuthService
  ){}

  ngOnInit(): void {
    this.getUser()
  }

  getUser(){
    this.user = this._auth.getUser();
  }

  logout(){
    localStorage.removeItem('token')
    this._router.navigateByUrl("/login")
  }

}
