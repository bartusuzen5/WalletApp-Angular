import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-wallet-chart',
  standalone: true,
  imports: [SharedModule, NgxChartsModule],
  templateUrl: './wallet-chart.component.html',
  styleUrl: './wallet-chart.component.css',
})
export class WalletChartComponent implements OnChanges{

  totalMarginTry: number = 0
  totalMarginUsd: number = 0
  totalBalanceTry: number = 0
  totalBalanceUsd: number = 0
  balanceTry: any[] = []
  balanceUsd: any[] = []
  marginTryPerc: any[] = []
  marginUsdPerc: any[] = []
  marginTry: any[] = []
  marginUsd: any[] = []
  selectedCurrency: string = '₺'

  @Input() items: any[];
  @Input() currencyItems: any[] = [];
  @Input() summaryHeader: string;

  @Output() selectFunc = new EventEmitter<any>()
  @Output() currencySwitchFunc = new EventEmitter<any>()
  
  constructor(){}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['items'] && changes['items'].currentValue)){
      this.loadPieChartData();
    }
  }

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

  loadPieChartData(){
    this.totalMarginTry = 0
    this.totalMarginUsd = 0
    this.totalBalanceTry = 0
    this.totalBalanceUsd = 0
    this.balanceTry = []
    this.balanceUsd = []
    this.marginTryPerc = []
    this.marginUsdPerc = []
    this.marginTry = []
    this.marginUsd = []
    this.items.forEach(item => {
      this.balanceUsd.push({
        "name": item.item.name,
        "value": item.currentValueUsd
      })
      this.balanceTry.push({
        "name": item.item.name,
        "value": item.currentValueTry
      })
      this.marginUsd.push({
        "name": item.item.name,
        "value": item.marginUsd
      })
      this.marginTry.push({
        "name": item.item.name,
        "value": item.marginTry
      })
      this.marginUsdPerc.push({
        "name": item.item.name,
        "value": item.marginUsdPerc
      })
      this.marginTryPerc.push({
        "name": item.item.name,
        "value": item.marginTryPerc
      })
      this.totalBalanceUsd += item.currentValueUsd
      this.totalBalanceTry += item.currentValueTry
      this.totalMarginUsd += item.marginUsd
      this.totalMarginTry += item.marginTry
    });
    
    this.currencyItems.forEach(item => {
      this.balanceUsd.push({
        "name": item.item.name,
        "value": item.currentValueUsd
      })
      this.balanceTry.push({
        "name": item.item.name,
        "value": item.currentValueTry
      })
      this.totalBalanceUsd += item.currentValueUsd
      this.totalBalanceTry += item.currentValueTry
    });
    this.balanceUsd = [...this.balanceUsd]
    this.balanceTry = [...this.balanceTry]
    this.marginUsd = [...this.marginUsd]
    this.marginTry = [...this.marginTry]
    this.marginUsdPerc = [...this.marginUsdPerc]
    this.marginTryPerc = [...this.marginTryPerc]
  };
}
