import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { CategoryModel } from '../models/category.model';
import { CurrencyModel } from '../../currency/models/currency.model';
import { MessageResponseModel } from '../../../shared/models/message-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private _http: GenericHttpService
  ) { }

  public getAll(): Observable<CategoryModel[]>{
    return this._http.get<CategoryModel[]>("category");
  }

  public getById(categoryId: String): Observable<CategoryModel>{
    let model = {categoryId: categoryId};
    return this._http.post("category/getById", model);
  }

  public add(model: CategoryModel): Observable<any>{
    return this._http.post<any>("category/add", model);
  }

  public update(model: CategoryModel): Observable<any>{
    return this._http.post<any>("category/update", model);
  }

  public removeById(removeModel: CategoryModel): Observable<any>{
    let model = {_id: removeModel._id};
    return this._http.post<any>("category/removeById", model);
  }
}
