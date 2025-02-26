import { Component, OnInit } from '@angular/core';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { WalletService } from './services/wallet.service';
import { Router } from '@angular/router';
import { WalletCategoryModel } from './models/wallet-category';
import { WalletCurrencyModel } from './models/wallet-currency';
import { AuthService } from '../../core/services/auth.service';
import { ChartModule } from '../../shared/modules/chart/chart.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { PipeModule } from '../../shared/modules/pipe/pipe.module';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [SharedModule, PipeModule, ChartModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit{

  walletCategories: WalletCategoryModel[] = [];
  walletCurrencies: WalletCurrencyModel[] = [];
 
  isLoading: boolean
  selectedCurrency: string = '₺'

  itemHeaders = [
    { header: 'Kategori Adı', key: 'item.name'},
    { header: 'Mevcut Bakiye', key: this.selectedCurrency === '₺' ? 'currentValueTry' : 'currentValueUsd'},
    { header: 'Kar/Zarar', key: this.selectedCurrency === '₺' ? 'marginTry' : 'marginUsd'},
    { header: 'Kar/Zarar Yüzdesi', key: this.selectedCurrency === '₺' ? 'marginTryPerc' : 'marginUsdPerc'}
  ]

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _router: Router,
    private _wallet: WalletService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.getCategoryWallet();
    this.getCurrencyWallet();
  }

  onSelect(selectedCategory: any){
    const category = this.walletCategories.find(c => c.item.name === selectedCategory.name);
    this._router.navigate(['/wallet-category', category._id])
  };

  currencySwitch(currency: any){
    this.selectedCurrency = currency
  };

  getCategoryWallet(){
    this.isLoading = true
    this._apiSubscriber.Api('get',
      this._wallet.getAllCategory(this._auth.getUser()._id),
      (response) => {
        this.walletCategories = response;
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
