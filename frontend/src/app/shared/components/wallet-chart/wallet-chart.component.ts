import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPipe } from '../../pipes/generic.pipe';
import { CustomNumberPipe } from '../../pipes/custom-number.pipe';
import { Currency2Pipe } from '../../pipes/currency.pipe';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-wallet-chart',
  standalone: true,
  imports: [CommonModule, CustomNumberPipe, Currency2Pipe, RouterModule, NgxChartsModule],
  templateUrl: './wallet-chart.component.html',
  styleUrl: './wallet-chart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletChartComponent{

  @Input() summaryHeader: string
  @Input() totalMarginTry: number
  @Input() totalMarginUsd: number
  @Input() totalBalanceTry: number
  @Input() totalBalanceUsd: number
  @Input() balanceTry: any[]
  @Input() balanceUsd: any[]
  @Input() marginTryPerc: any[]
  @Input() marginUsdPerc: any[]
  @Input() marginTry: any[]
  @Input() marginUsd: any[]
  @Output() selectFunc = new EventEmitter<any>()
  @Output() currencySwitchFunc = new EventEmitter<any>()

  @ContentChild(TemplateRef) customContent?: TemplateRef<any>;

  selectedCurrency: string = '₺'
  
  constructor(){}

  handleSwitchChange(){
    if (this.selectedCurrency === '₺'){
      this.selectedCurrency = '$'
    } else {
      this.selectedCurrency = '₺'
    }
    this.currencySwitchFunc.emit(this.selectedCurrency)
  }

  onSelect(item: any){
    if (this.selectFunc){
      this.selectFunc.emit(item)
    }
  }
}
