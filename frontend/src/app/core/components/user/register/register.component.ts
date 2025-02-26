import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiSubscriberService } from '../../../../shared/services/api-subscriber.service';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';
import { UserBaseComponent } from '../user-base/user-base.component';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { ValidationDirective } from '../../../../shared/directives/form-validation.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, UserBaseComponent, ValidationDirective],
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
      delete form.value.passwordRepeat
      this._apiSubscriber.Api("post",
        this._register.addUser(form.value),
        () => {
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
