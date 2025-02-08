import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPipe } from '../../../pipes/generic.pipe';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../pagination/pagination.component';
import { PaginationUtils } from '../../../utilities/pagination.utils';

@Component({
  selector: 'app-table-base',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './table-base.component.html',
  styleUrl: './table-base.component.css'
})
export class TableBaseComponent implements OnInit, OnChanges{
  @Input() items: any[] = [];
  @Input() itemHeaders: { header: string, key: string }[] = [];
  @Input() header: string = '';

  @Input() mainRowsTemplate!: TemplateRef<any>;
  @ContentChild(TemplateRef) extraRowsTemplate!: TemplateRef<any>;

  filteredItems: any[] = [];
  paginatedItems: any[] = [];

  filters: { [key: string]: string } = {};
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchValue: string = ''
  nullColumns: string[] = []

  itemsPerPage: number;
  currentPage: number = 1;

  constructor(
    private _genericPipe: GenericPipe
  ){}

  ngOnInit(): void {
    this.createFilters();
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue){
      this.filteredItems = this.items
      this.updatePaginatedData();
    }
  }

  search(){
    this.filteredItems = this._genericPipe.transform(this.items, this.filters, this.sortColumn, this.sortOrder, this.nullColumns)
    this.updatePaginatedData();
  };

  createFilters(){
    this.itemHeaders.forEach((item) => {
      this.filters[item.key] = ''
    })
  };

  sort(order: 'asc' | 'desc', key: string){
    this.sortOrder = order;
    this.sortColumn = key;
    this.search();
  };

  reset(key: string){
    this.filters[key] = ''
    this.search();
  };

  resetFilters(){
    Object.keys(this.filters).forEach(key => this.filters[key] = '');
    this.search();
  }

  addDropNullColumn(key: string){
    const index = this.nullColumns.indexOf(key);
    if (index > -1) {
      this.nullColumns.splice(index, 1);
    } else {
      this.nullColumns.push(key);
    }
    this.search()
  };

  onPageChanged(eventData: { currentPage: number, itemsPerPage: number }){
    this.currentPage = eventData.currentPage;
    this.itemsPerPage = eventData.itemsPerPage;
    this.updatePaginatedData();
  };
  
  updatePaginatedData(){
    this.paginatedItems = PaginationUtils.updatePaginatedData(this.currentPage, this.itemsPerPage, this.filteredItems)
  };
}
