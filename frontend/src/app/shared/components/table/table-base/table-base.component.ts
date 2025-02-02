import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPipe } from '../../../pipes/generic.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-base',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-base.component.html',
  styleUrl: './table-base.component.css'
})
export class TableBaseComponent {
  @Input() items: any[] = [];
  @Input() filteredItems: any[] = [];
  @Input() paginatedItems: any[] = [];
  @Input() itemHeaders: { header: string, key: string }[] = [];
  @Input() header: string = '';

  @Input() mainRowsTemplate!: TemplateRef<any>;
  @ContentChild(TemplateRef) extraRowsTemplate!: TemplateRef<any>;

  @Output() filterAction = new EventEmitter<{ filteredItems: any[] }>();

  filters: { [key: string]: string } = {};
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchValue: string = ''
  nullColumns: string[] = []

  constructor() {}

  ngOnInit(): void {
    this.createFilters();
  }

  onFilter(){
    const pipe = new GenericPipe()
    this.filteredItems = pipe.transform(this.items, this.filters, this.sortColumn, this.sortOrder, this.nullColumns)
    this.filterAction.emit({filteredItems: this.filteredItems})
  }

  createFilters(){
    this.itemHeaders.forEach((item) => {
      this.filters[item.key] = ''
    })
  }

  sort(order: 'asc' | 'desc', key: string){
    this.sortOrder = order;
    this.sortColumn = key;
    this.onFilter();
  }

  search(){
    this.onFilter();
  }

  reset(key: string){
    this.filters[key] = ''
    this.onFilter();
  }

  addDropNullColumn(key: string){
    const index = this.nullColumns.indexOf(key);
    if (index > -1) {
      this.nullColumns.splice(index, 1);
    } else {
      this.nullColumns.push(key);
    }
    this.onFilter()
  }
}
