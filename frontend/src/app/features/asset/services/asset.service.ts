import { Injectable, model } from '@angular/core';
import { GenericHttpService } from '../../../shared/services/generic-http.service';
import { AssetModel } from '../models/asset.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(
    private _http: GenericHttpService
  ) { }

  getAll(): Observable<AssetModel[]>{
    return this._http.get<AssetModel[]>("asset");
  }

  getAssetsByCategory(categoryId: string): Observable<AssetModel[]>{
    let model = {categoryId: categoryId}
    return this._http.post<AssetModel[]>("asset/getByCategory", model);
  }

  add(model: AssetModel): Observable<any>{
    return this._http.post<any>("asset/add", model)
  }

  update(model: AssetModel): Observable<any>{
    return this._http.post("asset/update", model)
  }

  removeById(asset: AssetModel): Observable<any>{
    let model = {_id: asset._id};
    return this._http.post("asset/removeById", model)
  }
}
