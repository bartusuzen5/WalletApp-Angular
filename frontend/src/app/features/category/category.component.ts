import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CategoryService } from './services/category.service';
import { CategoryModel } from './models/category.model';
import { NgForm } from '@angular/forms';
import { CurrencyModel } from '../currency/models/currency.model';
import { CurrencyService } from '../currency/services/currency.service';
import { SwalService } from '../../core/services/swal.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { NavbarService } from '../../core/components/navbar/services/navbar.service';
import { PaginationUtils } from '../../shared/utilities/pagination.utils';
import { GenericUtils } from '../../shared/utilities/generic.utils';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  categories: CategoryModel[] = [];
  paginatedCategories: CategoryModel[] = [];
  search: string = "";
  updateCategory: CategoryModel = new CategoryModel();
  addModalCloseBtn: any
  updateModalCloseBtn: any

  currencies: CurrencyModel[] = [];
  
  itemsPerPage: number;
  currentPage: number = 1;

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _category: CategoryService,
    private _currency: CurrencyService,
    private _navbar: NavbarService
  ){}

  ngOnInit(): void {
    this.getAll();
    this.getCurrencies();
  };

  ngAfterViewInit(): void {
    this.addModalCloseBtn = document.getElementById("addModalCloseBtn");
    this.updateModalCloseBtn = document.getElementById("updateModalCloseBtn");
  }


  getCurrencies(){
    this._apiSubscriber.getApi(
      this._currency.getAll(),
      (response) => {
        this.currencies = response;
      }
    )
  };


  getAll(){
    this._apiSubscriber.getApi(
      this._category.getAll(),
      (response) => {
        this.categories = response;
        this.updatePaginatedData();
      }
    )
   };


  add(form: NgForm){
    if (form.valid){
      let newCategory = form.value
      this._apiSubscriber.postApi(
        this._category.add(newCategory),
        () => {
          this.getAll();
          this._navbar.triggerUpdate();
          GenericUtils.resetForm(form, this.addModalCloseBtn);
        }
      )
    }
  };


  update(form: NgForm){
    if(form.valid){
      let updateCurrencyId = form.controls["currency"].value;
      let updateCurrency = this.currencies.find(c=> c._id = updateCurrencyId);
      this.updateCategory.currency = updateCurrency;

      this._apiSubscriber.postApi(
        this._category.update(this.updateCategory),
        () => {
          this.getAll();
          this._navbar.triggerUpdate();
          GenericUtils.resetForm(form, this.updateModalCloseBtn);
        }
      )
    }
  };


  removeById(model: CategoryModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", `${model.name}`, "Sil", ()=>{
      this._apiSubscriber.postApi(
        this._category.removeById(model),
        () => {
          this.getAll();
          this._navbar.triggerUpdate();
        }
      )
    })
  };


  copyUpdateCategory(category: CategoryModel){
    this.updateCategory = {...category};
  };


  onPageChanged(eventData: { currentPage: number, itemsPerPage: number }){
    this.currentPage = eventData.currentPage;
    this.itemsPerPage = eventData.itemsPerPage;
    this.updatePaginatedData();
  };


  updatePaginatedData(){
    this.paginatedCategories = PaginationUtils.updatePaginatedData(this.currentPage, this.itemsPerPage, this.categories)
  };

}
