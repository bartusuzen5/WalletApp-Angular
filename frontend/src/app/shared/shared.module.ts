import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GenericPipe } from './pipes/generic.pipe';
import { Currency2Pipe } from './pipes/currency.pipe';
import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';
import { ValidationDirective } from './directives/form-validation.directive';
import { ModalFooterComponent } from './components/modal-footer/modal-footer.component';
import { CustomNumberPipe } from './pipes/custom-number.pipe';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe,
    TableComponent,
    ModalComponent,
    ValidationDirective,
    ModalFooterComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe,
    TableComponent,
    ModalComponent,
    ValidationDirective,
    ModalFooterComponent
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
