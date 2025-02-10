import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { NgForm } from '@angular/forms';
import { ApiSubscriberService } from '../../../../shared/services/api-subscriber.service';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isPasswordsMatch: boolean = false
  @ViewChild('password') password!: ElementRef;

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _register: RegisterService,
    private _router: Router
  ){}

  register(form: NgForm){
    if(form.valid && this.isPasswordsMatch){
      this._apiSubscriber.Api("post",
        this._register.addUser(form.value),
        () => {
          console.log("Başarılı")
          this._router.navigateByUrl("/login")
        }
      )
    }
  }

  checkPwMatch(password_repeat: any){
    if(password_repeat != this.password.nativeElement.value){
      this.isPasswordsMatch = false
    } else {
      this.isPasswordsMatch = true
    }

  }
}
