import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../core/components/navbar/navbar.component';
import { GenericPipe } from './pipes/generic.pipe';
import { Currency2Pipe } from './pipes/currency.pipe';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { ValidationDirective } from './directives/form-validation.directive';
import { ModalFooterComponent } from './components/modal-footer/modal-footer.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomNumberPipe } from './pipes/custom-number.pipe';
import { WalletChartComponent } from './components/wallet-chart/wallet-chart.component';
import { TableChartComponent } from './components/table/table-chart/table-chart.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe,
    TableComponent,
    ModalComponent,
    ValidationDirective,
    ModalFooterComponent,
    NgxChartsModule,
    WalletChartComponent,
    TableChartComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent,
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe,
    TableComponent,
    ModalComponent,
    ValidationDirective,
    ModalFooterComponent,
    NgxChartsModule,
    WalletChartComponent,
    TableChartComponent
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
