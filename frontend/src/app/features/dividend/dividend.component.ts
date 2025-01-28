import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { DividendService } from './services/dividend.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { DividendModel } from './models/dividend.model';
import { NgForm } from '@angular/forms';
import { PaginationUtils } from '../../shared/utilities/pagination.utils';
import { CategoryModel } from '../category/models/category.model';
import { AssetModel } from '../asset/models/asset.model';
import { CategoryService } from '../category/services/category.service';
import { AssetService } from '../asset/services/asset.service';
import { SwalService } from '../../core/services/swal.service';
import { GenericUtils } from '../../shared/utilities/generic.utils';

@Component({
  selector: 'app-dividend',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dividend.component.html',
  styleUrl: './dividend.component.css'
})
export class DividendComponent implements OnInit{

  dividends: DividendModel[] = []
  paginatedDividends: DividendModel[] = []
  search: string = ''
  updateDividend: DividendModel = new DividendModel()
  addModalCloseBtn: any
  updateModalCloseBtn: any

  categories: CategoryModel[] = []
  selectedCategory: CategoryModel;
  assets: AssetModel[] = []

  paymentPerQuantityInput: number;
  quantityInput: number;
  paidInputUsd: number;
  paidInputTry: number;
  maxDate: string = new Date().toISOString().split('T')[0];
  yieldInput: number;
  @ViewChild('addForm') addForm: NgForm;

  itemsPerPage: number;
  currentPage: number = 1;


  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _dividend: DividendService,
    private _category: CategoryService,
    private _asset: AssetService
  ){}

  ngOnInit(): void {
    this.getAll();
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
        this.categories = response
      }
    )
  };


  getAssetsByCategory(){
    this._apiSubscriber.getApi(
      this._asset.getAssetsByCategory(this.selectedCategory._id),
      (response) => {
        this.assets = response
      }
    )
  };


  getAll(){
    this._apiSubscriber.getApi(
      this._dividend.getAll(),
      (response) => {
        this.dividends = response
        this.updatePaginatedData()
      }
    )
  };


  add(form: NgForm){
    if (form.valid){
      let newDividend = form.value
      console.log(newDividend)
      this._apiSubscriber.postApi(
        this._dividend.add(newDividend),
        () => {
          this.getAll()
          GenericUtils.resetForm(form, this.addModalCloseBtn);
          this.selectedCategory = null;
        }
      )
    }
  };


  update(form: NgForm){
    if (form.valid){
      this._apiSubscriber.postApi(
        this._dividend.update(this.updateDividend),
        () => {
          this.getAll()
          GenericUtils.resetForm(form, this.updateModalCloseBtn);
          this.selectedCategory = null;
        }
      )
    }
  };


  removeById(dividend: DividendModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", "Temettü", "Sil", () => {
      this._apiSubscriber.postApi(
        this._dividend.removeById(dividend),
        () => {
          this.getAll()
        }
      )
    })
  };


  updateAddForm(){
    this.addForm.reset();
    this.getAssetsByCategory();
  };

  
  copyUpdateDividend(dividend: DividendModel){
    this.updateDividend = {...dividend}
    this.updateDividend.yield *= 100
  };


  getPaidValue(){
    if (this.paymentPerQuantityInput && this.quantityInput){
      if (this.selectedCategory?.currency.symbol == '$'){
        this.paidInputUsd = this.quantityInput * this.paymentPerQuantityInput
      }else if (this.selectedCategory?.currency.symbol == '₺'){
        this.paidInputTry = this.quantityInput * this.paymentPerQuantityInput
      }
    }
  };
  

  getUpdatePaidValue(){
    if (this.updateDividend.paymentPerQuantity && this.updateDividend.quantity){
      if(this.updateDividend.asset.category.currency.symbol == '$'){
        this.updateDividend.paidUsd = this.updateDividend.quantity * this.updateDividend.paymentPerQuantity
      }else if (this.updateDividend.asset.category.currency.symbol == '₺'){
        this.updateDividend.paidTry = this.updateDividend.quantity * this.updateDividend.paymentPerQuantity
      }
    }
  };


  onPageChanged(eventData: { currentPage: number, itemsPerPage: number }){
    this.currentPage = eventData.currentPage
    this.itemsPerPage = eventData.itemsPerPage
    this.updatePaginatedData()
  };


  updatePaginatedData(){
    this.paginatedDividends = PaginationUtils.updatePaginatedData(this.currentPage, this.itemsPerPage, this.dividends)
  };

}
