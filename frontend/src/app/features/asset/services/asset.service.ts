import { Injectable } from '@angular/core';
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

  public getAll(): Observable<AssetModel[]>{
    return this._http.get<AssetModel[]>("asset");
  }

  public getAssetsByCategory(categoryId: string): Observable<AssetModel[]>{
    return this._http.post<AssetModel[]>("asset/getByCategory", {categoryId});
  }

  public add(asset: AssetModel): Observable<any>{
    return this._http.post<any>("asset/add", asset)
  }

  public update(asset: AssetModel): Observable<any>{
    return this._http.put(`asset/update/${asset._id}`, asset)
  }

  public removeById(assetId: string): Observable<any>{
    return this._http.delete("asset/removeById", assetId)
  }
}
