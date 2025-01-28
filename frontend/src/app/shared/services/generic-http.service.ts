import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {

  api: string = "http://localhost:5000/api";

  constructor(
    private _http: HttpClient,
    private _spinner: NgxSpinnerService

  ) { }


  public get<T>(api: string): Observable<T> {
    this._spinner.show();
    return this._http.get<T>(`${this.api}/${api}`, { observe: 'response' }).pipe(
      map((response) => {
        if (response) {
          return response.body;
        } else {
          throw new Error('No body in response');
        }
      })
    );
  }


  public post<T>(api: string, body: any): Observable<T> {
    this._spinner.show();
    return this._http.post<T>(`${this.api}/${api}`, body, { observe: 'response' }).pipe(
      map((response) => {
        if (response) {
          return response.body;
        } else {
          throw new Error('No body in response');
        }
      })
    );
  }
}
