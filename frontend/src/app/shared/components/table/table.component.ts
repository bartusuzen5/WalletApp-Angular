import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableBaseComponent } from './table-base/table-base.component';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableBaseComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent{
   
  @Input() items: any[] = [];
  @Input() itemHeaders: { header: string, key: string }[] = [];
  @Input() header: string = '';
  @Input() addModalId: string = 'addModalId';
  @Input() updateModalId: string = 'updateModalId';
  @ContentChild(TemplateRef) mainRowsTemplate!: TemplateRef<any>;

  @Output() editAction = new EventEmitter<any>();
  @Output() deleteAction = new EventEmitter<any>();

  constructor() {}

  onEdit(item: any) {
    this.editAction.emit(item);
  }

  onDelete(item: any) {
    this.deleteAction.emit(item);
  }
}
