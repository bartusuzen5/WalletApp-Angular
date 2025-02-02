import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { AssetModel } from './models/asset.model';
import { CategoryModel } from '../category/models/category.model';
import { AssetService } from './services/asset.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../category/services/category.service';
import { SwalService } from '../../core/services/swal.service';
import { GenericUtils } from '../../shared/utilities/generic.utils';
import { PaginationUtils } from '../../shared/utilities/pagination.utils';


@Component({
  selector: 'app-asset',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.css'
})

export class AssetComponent implements OnInit {
  assets: AssetModel[] = [];
  filteredAssets: AssetModel[] = [];
  paginatedAssets: AssetModel[] = [];
  search: string = "";
  updateAsset: AssetModel = new AssetModel();
  addModalCloseBtn: any
  updateModalCloseBtn: any

  categoryId: string = "";
  category: CategoryModel = new CategoryModel();
  categories: CategoryModel[] = [];
    
  itemsPerPage: number;
  currentPage: number = 1;

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _asset: AssetService,
    private _category: CategoryService,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.getCategories();
  };

  ngAfterViewInit(): void {
    this.addModalCloseBtn = document.getElementById("addModalCloseBtn");
    this.updateModalCloseBtn = document.getElementById("updateModalCloseBtn");
  }


  getCategories(){
    this._apiSubscriber.getApi(
      this._category.getAll(),
      (response) => {
        this.categories = response;
        this.getAssetCategory();
      }
    )
  };


  getAssetCategory(){
    this._route.paramMap.subscribe(params => {
      this.categoryId = params.get('category');
      this.category = this.categories.find(c => c._id === this.categoryId);
      this.getAssetsByCategory();
    });
  };


  getAssetsByCategory(){
    this._apiSubscriber.getApi(
      this._asset.getAssetsByCategory(this.categoryId),
      (response) => {
        this.assets = response
        this.filteredAssets = this.assets
        this.updatePaginatedData();
      }
    )
  };


  add(form: NgForm){
    if(form.valid){
      let newAsset = form.value;
      newAsset.category = this.category
      this._apiSubscriber.postApi(
        this._asset.add(newAsset),
        () => {
          this.getAssetsByCategory();
          GenericUtils.resetForm(form, this.addModalCloseBtn);
        }
      )
    }
  };


  update(form: NgForm){
    if(form.valid){
      this._apiSubscriber.postApi(
        this._asset.update(this.updateAsset),
        () => {
          this.getAssetsByCategory();
          GenericUtils.resetForm(form, this.updateModalCloseBtn);
        }
      )
    }
  };


  removeById(asset: AssetModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", `${asset.name}`, "Sil", ()=>{
      this._apiSubscriber.postApi(
        this._asset.removeById(asset),
        () => {
          this.getAssetsByCategory()
        }
      )
    })
  };


  copyUpdateAsset(asset: AssetModel){
    this.updateAsset = {...asset};
  };

  
  onFilteredItems(eventData: {filteredItems: any[]}){
    this.filteredAssets = eventData.filteredItems
    this.updatePaginatedData();
  }


  onPageChanged(eventData: { currentPage: number, itemsPerPage: number }){
    this.currentPage = eventData.currentPage;
    this.itemsPerPage = eventData.itemsPerPage;
    this.updatePaginatedData();
  };


  updatePaginatedData(){
    this.paginatedAssets = PaginationUtils.updatePaginatedData(this.currentPage, this.itemsPerPage, this.filteredAssets)
  };
}
