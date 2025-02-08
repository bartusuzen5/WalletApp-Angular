import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { WalletService } from './services/wallet.service';
import { Router } from '@angular/router';

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
    let category = this.walletCategories.find(c => c.item.name === selectedCategory.name);
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
      }
    )
  }
}
