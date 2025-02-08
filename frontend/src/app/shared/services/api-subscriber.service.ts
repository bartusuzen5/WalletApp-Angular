import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiSubscriberService {

  constructor(
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService 
  ) { }


  Api(
    requestType: 'get' | 'post',
    observable: Observable<any>,
    onSuccess: (response: any) => void,
    onError: (error: any) => void = () => {}
  ): void{
    this._spinner.show();
    observable.subscribe({
      next: (response) => {
        onSuccess(response);
        if (requestType === 'post'){
          this._toastr.success(response.message)
        }
        this._spinner.hide();
      },
      error: (err) => {
        onError(err);        
        this._toastr.error(err.error.message);
        this._spinner.hide();
      }
    })
  };
}
