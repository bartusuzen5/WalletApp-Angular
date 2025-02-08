import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from '../../category/models/category.model';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { AssetService } from '../../asset/services/asset.service';
import { AssetModel } from '../../asset/models/asset.model';
import { WalletService } from '../services/wallet.service';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-wallet-category',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './wallet-category.component.html',
  styleUrl: './wallet-category.component.css'
})
export class WalletCategoryComponent implements OnInit{

  categoryId: string = 'all'
  category: CategoryModel = new CategoryModel()
  walletAssets: any[] = []

  balanceTry: any[] = []
  balanceUsd: any[] = []
  marginTry: any[] = []
  marginUsd: any[] = []
  marginTryPerc: any[] = []
  marginUsdPerc: any[] = []

  totalBalanceTry: number = 0
  totalBalanceUsd: number = 0
  totalMarginUsd: number = 0
  totalMarginTry: number = 0

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
    private _category: CategoryService
  ) {}

  ngOnInit(): void {
    this.getAssetCategory()
  }

  currencySwitchFunc(currency: string){
    this.selectedCurrency = currency
  }


  getAssetCategory(){
    this._route.paramMap.subscribe(params => {
      this.categoryId = params.get('category');
    });
    this.getAssetsByCategory();
    if(this.categoryId != 'all'){
      this.getCategoryById()
    }
  };

  getCategoryById(){
    this._apiSubscriber.Api('get',
      this._category.getById(this.categoryId),
      (response) => {
        this.category = response
      }
    )
  };

  getAssetsByCategory(){
    this._apiSubscriber.Api('get',
      this._wallet.getAssetsByCategory(this.categoryId),
      (response) => {
        this.walletAssets = response
        console.log(this.walletAssets)
      }
    )
  };
}
