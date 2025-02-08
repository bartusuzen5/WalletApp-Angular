import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericPipe } from '../../../pipes/generic.pipe';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { TableBaseComponent } from '../table-base/table-base.component';



@Component({
  selector: 'app-table-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, TableBaseComponent],
  templateUrl: './table-chart.component.html',
  styleUrl: './table-chart.component.css'
})
export class TableChartComponent {

  @Input() items: any[] = [];
  @Input() itemHeaders: { header: string, key: string }[] = [];
  @Input() header: string = '';

  @ContentChild(TemplateRef) mainRowsTemplate!: TemplateRef<any>;
}
