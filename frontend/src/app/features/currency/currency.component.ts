import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyService } from './services/currency.service';
import { CurrencyModel } from './models/currency.model';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SwalService } from '../../core/services/swal.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { PaginationUtils } from '../../shared/utilities/pagination.utils';
import { GenericUtils } from '../../shared/utilities/generic.utils';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css'
})
export class CurrencyComponent implements OnInit{

  currencies: CurrencyModel[] = [];
  paginatedCurrencies: CurrencyModel[] = [];
  updateCurrency: CurrencyModel = new CurrencyModel();
  search: string = "";
  addModalCloseBtn: any
  updateModalCloseBtn: any

  itemsPerPage: number;
  currentPage: number = 1;

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _currency: CurrencyService
  ){}

  ngOnInit(): void {
    this.getAll();
  };

  ngAfterViewInit(): void {
    this.addModalCloseBtn = document.getElementById("addModalCloseBtn");
    this.updateModalCloseBtn = document.getElementById("updateModalCloseBtn");
  }


  getAll(){
    this._apiSubscriber.getApi(
      this._currency.getAll(),
      (response) => {
        this.currencies = response;
        this.updatePaginatedData();
      }
    )
  };


  add(form: NgForm){
    if(form.valid){
      let newCurrency = form.value
      this._apiSubscriber.postApi(
        this._currency.add(newCurrency),
        () => {
          this.getAll();
          GenericUtils.resetForm(form, this.addModalCloseBtn);
        }
      )
    }
  };


  update(form: NgForm){
    if(form.valid){
      this._apiSubscriber.postApi(
        this._currency.update(this.updateCurrency),
        () => {
          this.getAll();
          GenericUtils.resetForm(form, this.updateModalCloseBtn);
        }
      )
    }
  };


  removeById(model: CurrencyModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", `${model.name}`, "Sil", ()=>{
      this._apiSubscriber.postApi(
        this._currency.removeById(model),
        () => {
          this.getAll();
        }
      )
    })
  };


  copyUpdateCurrency(model: CurrencyModel){
    this.updateCurrency = {...model};
  };


  onPageChanged(eventData: { currentPage: number, itemsPerPage: number }){
    this.currentPage = eventData.currentPage;
    this.itemsPerPage = eventData.itemsPerPage;
    this.updatePaginatedData();
  };


  updatePaginatedData(){
    this.paginatedCurrencies = PaginationUtils.updatePaginatedData(this.currentPage, this.itemsPerPage, this.currencies)
  };


}
