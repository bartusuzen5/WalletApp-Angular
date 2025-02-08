import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CategoryModel } from '../category/models/category.model';
import { CategoryService } from '../category/services/category.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { WalletService } from './services/wallet.service';
import { Router } from '@angular/router';
import { CurrencyModel } from '../currency/models/currency.model';
import { TradeModel } from '../trade/models/trade.model';
import { PaginationUtils } from '../../shared/utilities/pagination.utils';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit{

  walletCategories: any[] = [];
 
  categoryBalanceTry: any[] = []
  categoryBalanceUsd: any[] = []
  categoryMarginTry: any[] = []
  categoryMarginUsd: any[] = []
  categoryMarginTryPerc: any[] = []
  categoryMarginUsdPerc: any[] = []
  
  totalBalanceTry: number = 0
  totalBalanceUsd: number = 0
  totalMarginUsd: number = 0
  totalMarginTry: number = 0

  selectedCurrency: string = '₺'

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _router: Router,
    private _wallet: WalletService
  ) {}

  ngOnInit(): void {
    this.getCategoryWallet();
  }

  onSelect(selectedCategory: any){
    let category = this.walletCategories.find(c => c.category.name === selectedCategory.name);
    this._router.navigate(['/wallet-category', category._id])
  }

  currencySwitch(currency: any){
    this.selectedCurrency = currency
  }

  getCategoryWallet(){
    this._apiSubscriber.Api('get',
      this._wallet.getAllCategory(),
      (response) => {
        this.walletCategories = response;
        this.loadPieChartData();
      }
    )
  }

  loadPieChartData(){
    this.walletCategories.forEach(trade => {
      this.categoryBalanceUsd.push({
        "name": trade.category.name,
        "value": trade.categoryCurrentValueUsd
      })
      this.categoryBalanceTry.push({
        "name": trade.category.name,
        "value": trade.categoryCurrentValueTry
      })
      this.categoryMarginUsd.push({
        "name": trade.category.name,
        "value": trade.marginUsd
      })
      this.categoryMarginTry.push({
        "name": trade.category.name,
        "value": trade.marginTry
      })
      this.categoryMarginUsdPerc.push({
        "name": trade.category.name,
        "value": trade.marginUsdPerc
      })
      this.categoryMarginTryPerc.push({
        "name": trade.category.name,
        "value": trade.marginTryPerc
      })
      this.totalBalanceUsd += trade.categoryCurrentValueUsd
      this.totalBalanceTry += trade.categoryCurrentValueTry
      this.totalMarginUsd += trade.marginUsd
      this.totalMarginTry += trade.marginTry
    });
    this.categoryBalanceUsd = [...this.categoryBalanceUsd]
    this.categoryBalanceTry = [...this.categoryBalanceTry]
    this.categoryMarginUsd = [...this.categoryMarginUsd]
    this.categoryMarginTry = [...this.categoryMarginTry]
    this.categoryMarginUsdPerc = [...this.categoryMarginUsdPerc]
    this.categoryMarginTryPerc = [...this.categoryMarginTryPerc]
  };
}
