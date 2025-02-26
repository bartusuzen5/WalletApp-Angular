import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../core/components/user/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../core/components/user/services/register.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
import { ValidationDirective } from '../../shared/directives/form-validation.directive';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [SharedModule, ValidationDirective],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit,AfterViewInit{

  user: UserModel
  updateUser: UserModel
  @ViewChild('userInfo') userInfo!: TemplateRef<any>
  activeTemplate!: TemplateRef<any>

  isPasswordsMatch: boolean = true
  @ViewChild('newPassword') newPassword!: ElementRef;

  constructor(
    private _auth: AuthService,
    private _cdRef: ChangeDetectorRef,
    private _toastr: ToastrService,
    private _register: RegisterService,
    private _apiSubscriber: ApiSubscriberService,
    private _router: Router
  ){}

  ngOnInit(): void {
    this.user = this._auth.getUser()
  }

  ngAfterViewInit(): void {
    this.activeTemplate = this.userInfo
    this._cdRef.detectChanges();
  }

  copyUpdateUser(){
    this.updateUser = {...this.user};
  }

  changeTemplate(template: TemplateRef<any>){
    this.activeTemplate = template
  }

  saveInfo(form: NgForm){
    if(form.valid){
      if(JSON.stringify(this.user) == JSON.stringify(this.updateUser)){
        this._toastr.info("Bir değişiklik yapılmamıştır!")
      } else {
        this._apiSubscriber.Api('post',
          this._register.updateUser(this.updateUser),
          () => {
            this.logout()
          }
        )
      }
    }
  }

  savePassword(form: NgForm){
    if(form.valid){
      if (!this.isPasswordsMatch){
        this._toastr.info('Şifreler eşleşmiyor!')
      } else {
        this._apiSubscriber.Api('post',
          this._register.updateUserPassword(form.value.oldPassword, form.value.newPassword, this.updateUser),
          () => {
            this.logout()
          }
        )
      }
    }
  }

  logout(){
    localStorage.removeItem('token')
    this._router.navigateByUrl("/login")
  }

  checkPwMatch(passwordRepeat: any){
    if(passwordRepeat != this.newPassword.nativeElement.value){
      console.log(this.isPasswordsMatch)
      this.isPasswordsMatch = false
    } else {
      this.isPasswordsMatch = true
    }
  }
}
