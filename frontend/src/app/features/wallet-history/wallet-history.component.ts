import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-wallet-history',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './wallet-history.component.html',
  styleUrl: './wallet-history.component.css'
})
export class WalletHistoryComponent {

}
