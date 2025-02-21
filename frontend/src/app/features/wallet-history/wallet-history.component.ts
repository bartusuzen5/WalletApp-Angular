import { Component, OnInit, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SwalService } from '../../core/services/swal.service';
import { ApiSubscriberService } from '../../shared/services/api-subscriber.service';
import { AuthService } from '../../core/services/auth.service';
import { WalletHistoryService } from './services/wallet-history.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-wallet-history',
  standalone: true,
  imports: [SharedModule, NgxChartsModule],
  templateUrl: './wallet-history.component.html',
  styleUrl: './wallet-history.component.css'
})
export class WalletHistoryComponent implements OnInit{

  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Value';

  years: any[] = []
  selectedYearPortfolio: string
  selectedYearAsset: string
  selectedYearCategory: string

  assetItems: any[] = []
  currencyItems: any[] = []
  categories: any[] = []
  selectedCategory: string = 'all';
  assets: any[] = []
  selectedAsset: string = 'all'
  selectedCategoryAsset: string = 'all'

  chartData: any[] = []
  categoryChartData: any[] = [];
  assetChartData: any[] = []

  selectedCurrency: string = '₺'

  constructor(
    private _apiSubscriber: ApiSubscriberService,
    private _walletHistory: WalletHistoryService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAll()
  };

  handleSwitchChange(){
    if (this.selectedCurrency === '₺'){
      this.selectedCurrency = '$'
    } else {
      this.selectedCurrency = '₺'
    }
    this.loadChartData();
  }

  loadChartData(){
    this.getChartData()
    this.getCategoryChartData();
    this.getAssetChartData();
  }

  getAll(){
    this._apiSubscriber.Api('get',
      this._walletHistory.getAll(),
      (response) => {
        this.assetItems = response.walletHistoryAsset
        this.currencyItems = response.walletHistoryCurrency
        this.getYears();
        this.getCategories();
        this.getAssets();
        this.loadChartData()
      }
    )
  }

  getYears() {
    const assetYears = this.assetItems.map(item => new Date(item.date).getFullYear());
    const currencyYears = this.currencyItems.map(item => new Date(item.date).getFullYear());
    const allYears = Array.from(new Set([...assetYears, ...currencyYears]));

    this.years = allYears.sort((a, b) => a - b).map(year => ({ id: year.toString(), name: year.toString() }));

    const currentYear = new Date().getFullYear().toString();
    this.selectedYearPortfolio = currentYear;
    this.selectedYearAsset = currentYear;
    this.selectedYearCategory = currentYear;
  };

  getChartData() {
    let groupedData = new Map<string, number>();
    this.assetItems.forEach(assetItem => {
      let formattedDateAsset = this.datePipe.transform(assetItem.date, 'dd-MM-yyyy');
      let yearAsset = formattedDateAsset?.split('-')[2]
      if (yearAsset !== this.selectedYearPortfolio) {
        return;
      }
      let value = this.selectedCurrency == '₺' ? assetItem.valueTry : assetItem.valueUsd;
      groupedData.set(formattedDateAsset, (groupedData.get(formattedDateAsset) || 0) + value);
    });

    this.currencyItems.forEach(currencyItem => {
      let formattedDateCurrency = this.datePipe.transform(currencyItem.date, 'dd-MM-yyyy');
      let yearCurrency = formattedDateCurrency?.split('-')[2]
      if (yearCurrency !== this.selectedYearPortfolio) {
        return;
      }
      let value = this.selectedCurrency == '₺' ? currencyItem.valueTry: currencyItem.valueUsd;
      groupedData.set(formattedDateCurrency, (groupedData.get(formattedDateCurrency) || 0) + value);
    });
    this.chartData = [
      {
        name: "Portfolio",
        series: Array.from(groupedData.entries()).map(([date, value]) => ({
          name: date,
          value: value
        }))
      }
    ];
  };

  getCategories() {
    const uniqueCategoriesMap = new Map<string, any>();
    this.assetItems.forEach(item => {
      if (item.asset.category) {
        uniqueCategoriesMap.set(item.asset.category._id, item.asset.category);
      }
    });
    this.categories = [
      { _id: 'all', name: 'Tüm Kategoriler' },
      ...Array.from(uniqueCategoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    ];
  };


  getCategoryChartData() {
    let groupedData = new Map<string, Map<string, number>>();
    this.assetItems.forEach(assetItem => {
      if (!assetItem.asset || !assetItem.asset.category || isNaN(assetItem.marginUsd) || isNaN(assetItem.marginTry)) {
        console.warn("Hatalı veri atlandı:", assetItem);
        return;
      }
      if(this.selectedCategory === 'all' || assetItem.asset.category._id === this.selectedCategory){
        let categoryName = assetItem.asset.category.name;
        let formattedDate = this.datePipe.transform(assetItem.date, 'dd-MM-yyyy');
        let year = formattedDate?.split('-')[2];
        let margin = this.selectedCurrency == '₺' ? assetItem.marginTry : assetItem.marginUsd || 0;
        if(year === this.selectedYearCategory){
          if (!groupedData.has(categoryName)) {
            groupedData.set(categoryName, new Map<string, number>());
          }
          let categorySeries = groupedData.get(categoryName)!;
          categorySeries.set(formattedDate, (categorySeries.get(formattedDate) || 0) + margin);
        }
      }
    });
    this.categoryChartData = Array.from(groupedData.entries()).map(([categoryName, seriesData]) => ({
      name: categoryName,
      series: Array.from(seriesData.entries()).map(([date, value]) => ({
        name: date,
        value: value
      }))
    }));
  };


  getAssets() {
    this.selectedAsset = 'all'
    const uniqueAssetsMap = new Map<string, any>();
    this.assetItems.forEach(item => {
      if (item.asset && (this.selectedCategoryAsset === 'all' || item.asset.category?._id === this.selectedCategoryAsset)) {
        uniqueAssetsMap.set(item.asset._id, item.asset);
      }
    });
    this.assets = [
      { _id: 'all', name: 'Tüm Varlıklar' },
      ...Array.from(uniqueAssetsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    ];
  };

  
  getAssetChartData() {
    let groupedData = new Map<string, Map<string, number>>();
  
    this.assetItems.forEach(assetItem => {
      if (!assetItem.asset || isNaN(assetItem.marginUsd) || isNaN(assetItem.marginTry)) {
        console.warn("Hatalı veri atlandı:", assetItem);
        return;
      }
  
      if (this.selectedAsset === 'all' || assetItem.asset._id === this.selectedAsset) {
        let assetName = assetItem.asset.name;
        let formattedDate = this.datePipe.transform(assetItem.date, 'dd-MM-yyyy');
        let year = formattedDate?.split('-')[2];
        let margin = this.selectedCurrency == '₺' ? assetItem.marginTry : assetItem.marginUsd || 0;
        let categoryMatch = this.selectedCategoryAsset === 'all' || this.selectedCategoryAsset === assetItem.asset.category?._id;;
        let assetMatch = this.selectedAsset === 'all' || this.selectedAsset === assetItem.asset?._id;
        
        if (categoryMatch && assetMatch && year === this.selectedYearAsset) {
          if (!groupedData.has(assetName)) {
            groupedData.set(assetName, new Map<string, number>());
          }
          let assetSeries = groupedData.get(assetName)!;
          assetSeries.set(formattedDate, (assetSeries.get(formattedDate) || 0) + margin);
        }
      }
    });
    this.assetChartData = Array.from(groupedData.entries()).map(([assetName, seriesData]) => ({
      name: assetName,
      series: Array.from(seriesData.entries()).map(([date, value]) => ({
        name: date,
        value: value
      }))
    }));
  };
}
