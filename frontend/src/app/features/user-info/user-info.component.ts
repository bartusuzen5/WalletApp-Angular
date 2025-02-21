import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../core/components/user/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../core/components/user/services/register.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [SharedModule],
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
      } else if(form.value.oldPassword != this.user.password){
        this._toastr.info('Eski şifre hatalı')
      } else {
        this.updateUser.password = form.value.newPassword
        this._apiSubscriber.Api('post',
          this._register.updateUser(this.updateUser),
          () => {
            this.logout()
          }
        )
      }
    }
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this._router.navigateByUrl("/login")
  }

  checkPwMatch(passwordRepeat: any){
    if(passwordRepeat != this.newPassword.nativeElement.value){
      this.isPasswordsMatch = false
    } else {
      this.isPasswordsMatch = true
    }
  }
}
