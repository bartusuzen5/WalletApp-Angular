import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SwalService } from '../../../core/services/swal.service';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { AuthService } from '../../../core/services/auth.service';
import { HistoryAddService } from '../services/history-add.service';
import { WalletHistoryAddModel } from '../models/wallet-history-add';


@Component({
  selector: 'app-history-add',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history-add.component.html',
  styleUrl: './history-add.component.css'
})
export class HistoryAddComponent {
  months = [
      { name: 'Ocak', value: '01' }, { name: 'Şubat', value: '02' }, { name: 'Mart', value: '03' },
      { name: 'Nisan', value: '04' }, { name: 'Mayıs', value: '05' }, { name: 'Haziran', value: '06' },
      { name: 'Temmuz', value: '07' }, { name: 'Ağustos', value: '08' }, { name: 'Eylül', value: '09' },
      { name: 'Ekim', value: '10' }, { name: 'Kasım', value: '11' }, { name: 'Aralık', value: '12' }
    ];
    years: number[] = [];
    
    selectedMonth: string;
    selectedYear: number
    lastDayOfMonth: string = '';
  
    constructor(
      private _swal: SwalService,
      private _apiSubscriber: ApiSubscriberService,
      private _auth: AuthService,
      private _historyAdd: HistoryAddService
    ) {
      const currentDate = new Date();
      this.selectedMonth = this.months[currentDate.getMonth()].value;
      this.selectedYear = currentDate.getFullYear();
  
      const currentYear = currentDate.getFullYear();
      for (let i = currentYear - 2; i <= currentYear + 1; i++) {
        this.years.push(i);
      }
      this.updateLastDay()
    }
  
    updateLastDay() {
      const year = this.selectedYear;
      const month = parseInt(this.selectedMonth, 10);
      const lastDay = new Date(year, month, 0).getDate();
      this.lastDayOfMonth = `${year}-${this.selectedMonth}-${lastDay}`;
    }
  
    selectDate() {
      this.updateLastDay()
      const formattedDate = new Date(`${this.lastDayOfMonth}T00:00:00Z`);
      let walletHistory = new WalletHistoryAddModel()
      walletHistory.date = formattedDate
      walletHistory.user = this._auth.getUser()
      this._swal.callSwal("Ekleme işlemini onaylıyor musunuz?", `${this.lastDayOfMonth}`, "Ekle", ()=>{
        this._apiSubscriber.Api('post',
          this._historyAdd.add(walletHistory),
          () => {}
        )
      })
    }
}
