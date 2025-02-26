import { NgModule } from '@angular/core';
import { WalletChartComponent } from '../../components/wallet-chart/wallet-chart.component';
import { TableChartComponent } from '../../components/table/table-chart/table-chart.component';

@NgModule({
  declarations: [],
  imports: [
    WalletChartComponent,
    TableChartComponent
  ],
  exports: [
    WalletChartComponent,
    TableChartComponent
  ]
})
export class ChartModule { }
