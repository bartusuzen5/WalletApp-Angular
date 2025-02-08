import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from '../../category/models/category.model';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
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
