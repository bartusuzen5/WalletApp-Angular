import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TradeService } from './services/trade.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { SharedModule } from '../../shared/shared.module';
import { TradeModel } from './models/trade.model';
import { NgForm } from '@angular/forms';
import { AssetModel } from '../asset/models/asset.model';
import { AssetService } from '../asset/services/asset.service';
import { CategoryModel } from '../category/models/category.model';
import { CategoryService } from '../category/services/category.service';
import { SwalService } from '../../core/services/swal.service';
import { GenericUtils } from '../../shared/utilities/generic.utils';

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit{

  trades: TradeModel[] = [];
  updateTrade: TradeModel = new TradeModel()
  addModalCloseBtn: any
  updateModalCloseBtn: any

  categories: CategoryModel[] = []
  selectedCategory: CategoryModel = null
  assets: AssetModel[] = []

  switchValue: boolean = true;
  priceInput: number;
  quantityInput: number;
  paidInputUsd: number = 0;
  paidInputTry: number = 0;
  maxDate: string = new Date().toISOString().split('T')[0];
  @ViewChild('addForm') addForm: NgForm;

  itemHeaders = [
    { header: 'Kategori Adı', key: 'asset.category.name' },
    { header: 'Varlık Kodu', key: 'asset.code' },
    { header: 'İşlem Türü', key: 'tradeType' },
    { header: 'Fiyat', key: 'price' },
    { header: 'Adet', key: 'quantity' },
    { header: 'Toplam Tutar(USD)', key: 'paidUsd' },
    { header: 'Toplam Tutar(TRY)', key: 'paidTry' },
    { header: 'İşlem Tarihi', key: 'tradeDate' }
  ]

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _trade: TradeService,
    private _asset: AssetService,
    private _category: CategoryService
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
    this._apiSubscriber.Api('get',
      this._category.getAll(),
      (response) => {
        this.categories = response
      }
    )
  };


  getAssetsByCategory(){
    this._apiSubscriber.Api('get',
      this._asset.getAssetsByCategory(this.selectedCategory._id),
      (response) => {
        this.assets = response
      }
    )
  };


  getAll(){
    this._apiSubscriber.Api('get',
      this._trade.getAll(),
      (response) => {
        this.trades = response
      }
    )
  };


  add(form: NgForm){
    if(form.valid){
      let newTrade = form.value;
      this._apiSubscriber.Api('post',
        this._trade.add(newTrade),
        () => {
          this.getAll();
          GenericUtils.resetForm(form, this.addModalCloseBtn)
          this.selectedCategory = null
        }
      )
    }
  };


  update(form: NgForm){
    if (form.valid){
      this._apiSubscriber.Api('post',
        this._trade.update(this.updateTrade),
        () => {
          this.getAll()
          GenericUtils.resetForm(form, this.updateModalCloseBtn)
          this.selectedCategory = null
        }
      )
    }
  };


  removeById(trade: TradeModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", "İşlem", "Sil", () => {
      this._apiSubscriber.Api('post',
        this._trade.removeById(trade),
        () => {
          this.getAll()
        }
      )
    })
  };


  switchTradeType(){
    this.switchValue === true ? this.switchValue = false : this.switchValue = true
  };


  updateAddForm(){
    this.addForm.reset();
    this.getAssetsByCategory();
  };


  getPaidValue(){
    if (this.priceInput && this.quantityInput){
      if(this.selectedCategory?.currency.symbol == '$'){
        this.paidInputUsd = this.quantityInput * this.priceInput
      }else if (this.selectedCategory?.currency.symbol == '₺'){
        this.paidInputTry = this.quantityInput * this.priceInput
      }
    }
  };


  getUpdatePaidValue(){
    if (this.updateTrade.price && this.updateTrade.quantity){
      if(this.updateTrade.asset.category.currency.symbol == '$'){
        this.updateTrade.paidUsd = this.updateTrade.quantity * this.updateTrade.price
      }else if (this.updateTrade.asset.category.currency.symbol == '₺'){
        this.updateTrade.paidTry = this.updateTrade.quantity * this.updateTrade.price
      }
    }
  };


  copyUpdateTrade(trade: TradeModel){
    this.updateTrade = {...trade}
  };
}
