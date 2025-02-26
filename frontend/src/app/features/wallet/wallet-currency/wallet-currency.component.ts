import { Component } from '@angular/core';
import { WalletUserCurrencyModel } from '../models/wallet-user-currency';
import { CurrencyModel } from '../../currency/models/currency.model';
import { NgForm } from '@angular/forms';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { WalletCurrencyService } from '../services/wallet-currency.service';
import { CurrencyService } from '../../currency/services/currency.service';
import { AuthService } from '../../../core/services/auth.service';
import { FeatureModule } from '../../../shared/modules/feature/feature.module';

@Component({
  selector: 'app-wallet-currency',
  standalone: true,
  imports: [FeatureModule],
  templateUrl: './wallet-currency.component.html',
  styleUrl: './wallet-currency.component.css'
})
export class WalletCurrencyComponent {

  walletCurrencies: WalletUserCurrencyModel[] = [];
  updateWalletCurrency: WalletUserCurrencyModel = new WalletUserCurrencyModel()

  currencies: CurrencyModel[] = []

  itemHeaders = [
    { header: 'Döviz/Nakit', key: 'currency.name' },
    { header: 'Adet', key: 'quantity' },
  ]

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _walletCurrency: WalletCurrencyService,
    private _currency: CurrencyService,
    private _auth: AuthService
  ){}

  ngOnInit(): void {
    this.getAll();
    this.getCurrencies();
  };

  getAll(){
    this._apiSubscriber.Api('get',
      this._walletCurrency.getAll(this._auth.getUser()._id),
      (response) => {
        this.walletCurrencies = response
      }
    )
  };

  getCurrencies(){
    this._apiSubscriber.Api('get',
      this._currency.getAll(),
      (response) => {
        this.currencies = response
      }
    )
  };


  add(form: NgForm){
    if(form.valid){
      const newWalletCurrency = form.value;
      newWalletCurrency.user = this._auth.getUser();
      this._apiSubscriber.Api('post',
        this._walletCurrency.add(newWalletCurrency),
        () => {
          this.getAll()
        }
      )
    }
  };


  update(form: NgForm){
    if(form.valid){
      this._apiSubscriber.Api('post',
        this._walletCurrency.update(this.updateWalletCurrency),
        () => {
          this.getAll()
        }
      )
    }
  };


  copyUpdateWalletCurrency(walletCurrency: WalletUserCurrencyModel){
      this.updateWalletCurrency = {...walletCurrency}
    };
}
