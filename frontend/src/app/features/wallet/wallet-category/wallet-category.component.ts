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
    this._apiSubscriber.getApi(
      this._category.getById(this.categoryId),
      (response) => {
        console.log(response)
        this.category = response
      }
    )
  };

  getAssetsByCategory(){
    this._apiSubscriber.getApi(
      this._wallet.getAssetsByCategory(this.categoryId),
      (response) => {
        this.walletAssets = response
        this.loadPieChartData();
      }
    )
  };

  loadPieChartData(){
    this.totalBalanceUsd = 0
    this.totalBalanceTry = 0
    this.totalMarginUsd = 0
    this.totalMarginTry = 0
    this.balanceUsd = []
    this.balanceTry = []
    this.marginUsd = []
    this.marginTry = []
    this.marginUsdPerc = []
    this.marginTryPerc = []
    this.walletAssets.forEach(trade => {
      this.balanceUsd.push({
        "name": trade.asset.name,
        "value": trade.currentValueUsd
      })
      this.balanceTry.push({
        "name": trade.asset.code,
        "value": trade.currentValueTry
      })
      this.marginUsd.push({
        "name": trade.asset.code,
        "value": trade.marginUsd
      })
      this.marginTry.push({
        "name": trade.asset.code,
        "value": trade.marginTry
      })
      this.marginUsdPerc.push({
        "name": trade.asset.code,
        "value": trade.marginUsdPerc
      })
      this.marginTryPerc.push({
        "name": trade.asset.code,
        "value": trade.marginTryPerc
      })
      this.totalBalanceUsd += trade.currentValueUsd
      this.totalBalanceTry += trade.currentValueTry
      this.totalMarginUsd += trade.marginUsd
      this.totalMarginTry += trade.marginTry
    });
    this.balanceUsd = [...this.balanceUsd]
    this.balanceTry = [...this.balanceTry]
    this.marginUsd = [...this.marginUsd]
    this.marginTry = [...this.marginTry]
    this.marginUsdPerc = [...this.marginUsdPerc]
    this.marginTryPerc = [...this.marginTryPerc]
  }

  handleSwitchChange(){
    if (this.selectedCurrency === '₺'){
      this.selectedCurrency = '$'
    } else {
      this.selectedCurrency = '₺'
    }
  }
}
