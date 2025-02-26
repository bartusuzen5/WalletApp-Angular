import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { CategoryModel } from '../../category/models/category.model';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { WalletService } from '../services/wallet.service';
import { CategoryService } from '../../category/services/category.service';
import { WalletChartComponent } from '../../../shared/components/wallet-chart/wallet-chart.component';
import { TableChartComponent } from '../../../shared/components/table/table-chart/table-chart.component';
import { WalletCurrencyModel } from '../models/wallet-currency';
import { WalletAssetModel } from '../models/wallet-asset';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-wallet-category',
  standalone: true,
  imports: [SharedModule, WalletChartComponent, TableChartComponent],
  templateUrl: './wallet-category.component.html',
  styleUrl: './wallet-category.component.css'
})
export class WalletCategoryComponent implements OnInit{

  categoryId: string = 'all'
  category: CategoryModel = new CategoryModel()
  walletAssets: WalletAssetModel[] = []
  walletCurrencies: WalletCurrencyModel[] = []

  isLoading: boolean
  selectedCurrency: string = '₺'

  itemHeaders = [
    { header: 'Varlık Kodu', key: 'item.code'},
    { header: 'Mevcut Bakiye', key: this.selectedCurrency === '₺' ? 'currentValueTry' : 'currentValueUsd'},
    { header: 'Kar/Zarar', key: this.selectedCurrency === '₺' ? 'marginTry' : 'marginUsd'},
    { header: 'Kar/Zarar Yüzdesi', key: this.selectedCurrency === '₺' ? 'marginTryPerc' : 'marginUsdPerc'},
    { header: 'Kategori Adı', key: 'item.category.name'}
  ]

  constructor(
    private _route: ActivatedRoute,
    private _apiSubscriber: ApiSubscriberService,
    private _wallet: WalletService,
    private _category: CategoryService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getAssetCategory()
  }

  currencySwitchFunc(currency: string){
    this.selectedCurrency = currency
  }


  getAssetCategory(){
    this.isLoading = true
    this._route.paramMap.subscribe(params => {
      this.categoryId = params.get('category');
    });
    this.getAssetsByCategory();
    if(this.categoryId != 'all'){
      this.getCategoryById()
    } else {
      this.getCurrencyWallet();
    }
  };

  getCategoryById(){
    this._apiSubscriber.Api('get',
      this._category.getById(this.categoryId),
      (response) => {
        this.category = response
        this.isLoading = false
      }
    )
  };

  getAssetsByCategory(){
    this._apiSubscriber.Api('get',
      this._wallet.getAssetsByCategory(this._auth.getUser()._id, this.categoryId),
      (response) => {
        this.walletAssets = response
        console.log(this.walletAssets)
      }
    )
  };

  getCurrencyWallet(){
    this._apiSubscriber.Api('get',
      this._wallet.getAllCurrency(this._auth.getUser()._id),
      (response) => {
        this.walletCurrencies = response;
        this.isLoading = false
      }
    )
  };
}
