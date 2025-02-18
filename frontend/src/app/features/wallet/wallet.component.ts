import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { WalletService } from './services/wallet.service';
import { Router } from '@angular/router';
import { WalletChartComponent } from '../../shared/components/wallet-chart/wallet-chart.component';
import { TableChartComponent } from '../../shared/components/table/table-chart/table-chart.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [SharedModule, WalletChartComponent, TableChartComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit{

  walletCategories: any[] = [];
  walletCurrencies: any[] = [];
 
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
    private _wallet: WalletService
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
      this._wallet.getAllCategory(),
      (response) => {
        this.walletCategories = response;
      }
    )
  };

  getCurrencyWallet(){
    this._apiSubscriber.Api('get',
      this._wallet.getAllCurrency(),
      (response) => {
        this.walletCurrencies = response;
        this.isLoading = false
      }
    )
  };
}
