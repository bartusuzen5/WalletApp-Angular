import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPipe } from '../../pipes/generic.pipe';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, GenericPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit{
   
  @Input() items: any[] = [];
  @Input() itemHeaders: { header: string, key: string }[] = [];
  @Input() header: string = '';
  @Input() addModalId: string = 'addModalId';
  @Input() updateModalId: string = 'updateModalId';
  @Input() connectedAsset: string = null;
  @Input() chartTable: boolean = false;
  @ContentChild(TemplateRef) customContent?: TemplateRef<any>;

  @Output() editAction = new EventEmitter<any>();
  @Output() deleteAction = new EventEmitter<any>();

  filters: { [key: string]: string } = {};
  sortColumn: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchValue: string = ''
  nullColumns: string[] = []

  ngOnInit(): void {
    this.createFilters();
  }

  onEdit(item: any) {
    this.editAction.emit(item);
  }

  onDelete(item: any) {
    this.deleteAction.emit(item);
  }

  createFilters(){
    this.itemHeaders.forEach((item) => {
      this.filters[item.key] = ''
    })
  }

  sort(order: 'asc' | 'desc', key: string){
    this.sortOrder = order;
    this.sortColumn = key
  }

  search(){
    this.filters = {...this.filters}
  }

  reset(key: string){
    this.filters[key] = ''
    this.filters = {...this.filters}
  }

  addDropNullColumn(key: string){
    const index = this.nullColumns.indexOf(key);
    if (index > -1) {
      this.nullColumns.splice(index, 1);
    } else {
      this.nullColumns.push(key);
    }
    this.nullColumns = [...this.nullColumns]
  }
}
