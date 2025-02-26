import { Component, OnInit } from '@angular/core';
import { CurrencyService } from './services/currency.service';
import { CurrencyModel } from './models/currency.model';
import { NgForm } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SwalService } from '../../core/services/swal.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';


@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css'
})
export class CurrencyComponent implements OnInit{

  currencies: CurrencyModel[] = [];
  updateCurrency: CurrencyModel = new CurrencyModel();

  itemHeaders = [
    { header: 'Ad', key: 'name' },
    { header: 'Sembol', key: 'symbol' },
    { header: 'USD Değeri', key: 'valueUsd' },
    { header: 'TRY Değeri', key: 'valueTry' }
  ]

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _swal: SwalService,
    private _currency: CurrencyService
  ){}

  ngOnInit(): void {
    this.getAll();
  };


  getAll(){
    this._apiSubscriber.Api('get',
      this._currency.getAll(),
      (response) => {
        this.currencies = response;
        console.log(this.currencies)
      }
    )
  };


  add(form: NgForm){
    if(form.valid){
      const newCurrency: CurrencyModel = form.value
      this._apiSubscriber.Api('post',
        this._currency.add(newCurrency),
        () => {
          this.getAll();
          form.reset();
        }
      )
    }
  };


  update(form: NgForm){
    if(form.valid){
      this._apiSubscriber.Api('post',
        this._currency.update(this.updateCurrency),
        () => {
          this.getAll();
          form.reset();
        }
      )
    }
  };


  removeById(currency: CurrencyModel){
    this._swal.callSwal("Silme işlemini onaylıyor musunuz?", `${currency.name}`, "Sil", ()=>{
      this._apiSubscriber.Api('post',
        this._currency.removeById(currency._id),
        () => {
          this.getAll();
        }
      )
    })
  };

  copyUpdateCurrency(currency: CurrencyModel){
    this.updateCurrency = {...currency};
  };
}
