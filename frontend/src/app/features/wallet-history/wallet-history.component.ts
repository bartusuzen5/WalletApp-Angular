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

  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Month';
  yAxisLabel: string = 'Value';
  timeline: boolean = true;

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
        console.log(this.assetItems)
        console.log(this.currencyItems)
        this.getYears();
        this.getCategories();
        this.getAssets();
        this.loadChartData()
      }
    )
  }

  getYears() {
    // assetItems ve currencyItems'dan tarih bilgilerini alıyoruz
    const assetYears = this.assetItems.map(item => new Date(item.date).getFullYear());
    const currencyYears = this.currencyItems.map(item => new Date(item.date).getFullYear());
  
    // Yılları birleştiriyoruz ve distinct (benzersiz) hale getiriyoruz
    const allYears = Array.from(new Set([...assetYears, ...currencyYears]));
  
    // Yılları küçükten büyüğe sıralıyoruz
    this.years = allYears.sort((a, b) => a - b).map(year => ({ id: year.toString(), name: year.toString() }));
  
    // Mevcut yılı dropdown'da seçili yapmak için
    const currentYear = new Date().getFullYear().toString();
    this.selectedYearPortfolio = currentYear;
    this.selectedYearAsset = currentYear;
    this.selectedYearCategory = currentYear;
    console.log("Yıl Listesi:", this.years);
  }
  
  getChartData() {
    let groupedData = new Map<string, number>();
  
    // assetItems verisini filtreleyerek işliyoruz
    this.assetItems.forEach(assetItem => {
      let assetYear = new Date(assetItem.date).getFullYear().toString();
      
      // Seçilen yıla göre filtreleme
      if (this.selectedYearPortfolio !== 'all' && assetYear !== this.selectedYearPortfolio) {
        return; // Eğer veri seçilen yıl ile eşleşmiyorsa, atla
      }
  
      let formattedDate = this.datePipe.transform(assetItem.date, 'dd-MM-yyyy');
      let value = this.selectedCurrency == '₺' ? assetItem.valueTry : assetItem.valueUsd;
  
      // Tarihe göre gruplama yapıyoruz
      groupedData.set(formattedDate, (groupedData.get(formattedDate) || 0) + value);
    });
  
    // currencyItems verisini filtreleyerek işliyoruz
    this.currencyItems.forEach(currencyItem => {
      let currencyYear = new Date(currencyItem.date).getFullYear().toString();
      
      // Seçilen yıla göre filtreleme
      if (this.selectedYearPortfolio !== 'all' && currencyYear !== this.selectedYearPortfolio) {
        return; // Eğer veri seçilen yıl ile eşleşmiyorsa, atla
      }
  
      let formattedDate = this.datePipe.transform(currencyItem.date, 'dd-MM-yyyy');
      let value = this.selectedCurrency == '₺' ? currencyItem.valueTry: currencyItem.valueUsd;
  
      // Tarihe göre gruplama yapıyoruz
      groupedData.set(formattedDate, (groupedData.get(formattedDate) || 0) + value);
    });
  
    // Chart için uygun formatta veri oluşturuyoruz
    this.chartData = [
      {
        name: "Portfolio",
        series: Array.from(groupedData.entries()).map(([date, value]) => ({
          name: date,
          value: value
        }))
      }
    ];
    
    console.log("Chart Data:", this.chartData);
  }


  getCategories(){
    const uniqueCategories = this.assetItems
      .map(item => item.asset.category)
      .filter((category, index, self) => 
        category && self.findIndex(c => c._id === category._id) === index
      ); 
    this.categories = [
      { id: 'all', name: 'Tüm Kategoriler' },
      ...uniqueCategories.map(category => ({ id: category._id, name: category.name }))
    ];
  };

  getCategoryChartData() {
    let groupedData = new Map<string, Map<string, number>>();
  
    this.assetItems.forEach(assetItem => {
      if (!assetItem.asset || !assetItem.asset.category || isNaN(assetItem.marginUsd) || isNaN(assetItem.marginTry)) {
        console.warn("Hatalı veri atlandı:", assetItem);
        return;
      }
  
      // Yıl kontrolü - Seçilen yıla ait verileri filtreliyoruz
      const assetYear = new Date(assetItem.date).getFullYear().toString();
      if (this.selectedYearCategory !== assetYear && this.selectedYearCategory !== 'all') {
        return; // Eğer seçili yıl veriye uymuyorsa, bu veriyi atla
      }
  
      let categoryName = assetItem.asset.category.name; // Kategori ismini alıyoruz
      let formattedDate = this.datePipe.transform(assetItem.date, 'dd-MM-yyyy');
      let margin = this.selectedCurrency == '₺' ? assetItem.marginTry : assetItem.marginUsd || 0;
  
      // Eğer "all" seçiliyse her kategori için ayrı grup oluştur
      if (this.selectedCategory === 'all') {
        if (!groupedData.has(categoryName)) {
          groupedData.set(categoryName, new Map<string, number>());
        }
  
        let categorySeries = groupedData.get(categoryName)!;
        categorySeries.set(formattedDate, (categorySeries.get(formattedDate) || 0) + margin);
      } else {
        // Seçili kategoriye ait verileri grupla
        const selectedCategory = this.categories.find(category => category.id === this.selectedCategory);
        if (selectedCategory && assetItem.asset.category._id === selectedCategory.id) {
          if (!groupedData.has(selectedCategory.name)) { // Kategori adı kullanılıyor
            groupedData.set(selectedCategory.name, new Map<string, number>());
          }
  
          let selectedSeries = groupedData.get(selectedCategory.name)!;
          selectedSeries.set(formattedDate, (selectedSeries.get(formattedDate) || 0) + margin);
        }
      }
    });
  
    // **Chart için uygun formatta veri oluştur**
    this.categoryChartData = Array.from(groupedData.entries()).map(([categoryName, seriesData]) => ({
      name: categoryName,  // Kategori ismini kullanıyoruz
      series: Array.from(seriesData.entries()).map(([date, value]) => ({
        name: date,
        value: value
      }))
    }));
  
    console.log("Kategori Chart:", this.categoryChartData);
  };


  getAssets() {
    const uniqueAssetsMap = new Map<string, { id: string; name: string }>();
  
    // Assetleri unique hale getirmek ve her birinin adını almak
    this.assetItems.forEach(item => {
      if (item.asset && !uniqueAssetsMap.has(item.asset._id)) {
        uniqueAssetsMap.set(item.asset._id, { id: item.asset._id, name: item.asset.name });
      }
    });
  
    // Varlıkları alfabetik olarak sıralıyoruz
    this.assets = [
      { id: 'all', name: 'Tüm Varlıklar' },
      ...Array.from(uniqueAssetsMap.values()).sort((a, b) => a.name.localeCompare(b.name)) // İsme göre sıralama
    ];
  };

  
  getAssetChartData() {
    let groupedData = new Map<string, Map<string, number>>();
  
    // Seçilen asset'e ait veriyi filtreliyoruz
    this.assetItems.forEach(assetItem => {
      if (!assetItem.asset || isNaN(assetItem.marginUsd) || isNaN(assetItem.marginTry)) {
        console.warn("Hatalı veri atlandı:", assetItem);
        return;
      }
  
      // Seçili asset "all" değilse ve şu anki asset seçili asset ile eşleşiyorsa
      if (this.selectedAsset === 'all' || assetItem.asset._id === this.selectedAsset) {
        let assetName = assetItem.asset.name; // asset'in name'ini alıyoruz
        let formattedDate = this.datePipe.transform(assetItem.date, 'yyyy-MM-dd');  // Tarih formatını düzenledik
        let margin = this.selectedCurrency == '₺' ? assetItem.marginTry : assetItem.marginUsd || 0;
  
        // Yılı alıyoruz
        let year = formattedDate?.split('-')[0];
  
        // Seçilen yıl "all" değilse ve tarih yılı ile seçili yıl eşleşiyorsa
        if (this.selectedYearAsset === 'all' || year === this.selectedYearAsset) {
          // Eğer grup mevcut değilse, grup oluştur
          if (!groupedData.has(assetName)) {
            groupedData.set(assetName, new Map<string, number>());
          }
  
          // Asset'e ait seriyi grupluyoruz
          let assetSeries = groupedData.get(assetName)!;
          assetSeries.set(formattedDate, (assetSeries.get(formattedDate) || 0) + margin);
        }
      }
    });
  
    // **Chart için uygun formatta veri oluştur**
    this.assetChartData = Array.from(groupedData.entries()).map(([assetName, seriesData]) => ({
      name: assetName,  // Burada sadece seçilen asset'in name'ini kullanıyoruz
      series: Array.from(seriesData.entries()).map(([date, value]) => ({
        name: date,
        value: value
      }))
    }));
  
    console.log("Varlık Chart:", this.assetChartData);
  }  
}
