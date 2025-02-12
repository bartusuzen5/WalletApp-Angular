import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { NgForm } from '@angular/forms';
import { ApiSubscriberService } from '../../../../shared/services/api-subscriber.service';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { UserBaseComponent } from '../user-base/user-base.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, UserBaseComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  isPasswordsMatch: boolean = true
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

  checkPwMatch(passwordRepeat: any){
    if(passwordRepeat != this.password.nativeElement.value){
      this.isPasswordsMatch = false
    } else {
      this.isPasswordsMatch = true
    }
  }
}
