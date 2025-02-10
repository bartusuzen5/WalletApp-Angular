import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ApiSubscriberService } from '../../../../shared/services/api-subscriber.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _login: LoginService,
    private _router: Router
  ){}


  login(form: NgForm){
    if (form.valid){
      this._apiSubscriber.Api("post",
        this._login.getUser(form.value),
        (response) => {
          localStorage.setItem("token", response.token)
          localStorage.setItem("user", response.user)
          this._router.navigateByUrl("/")
        }
      )
    }
  }
}
