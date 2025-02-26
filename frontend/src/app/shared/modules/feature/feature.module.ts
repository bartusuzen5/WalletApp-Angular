import { NgModule } from '@angular/core';
import { ValidationDirective } from '../../directives/form-validation.directive';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { PipeModule } from '../pipe/pipe.module';
import { SharedModule } from '../shared.module';



@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    ValidationDirective,
    ModalComponent,
    TableComponent,
    PipeModule
  ],
  exports: [
    SharedModule,
    ValidationDirective,
    ModalComponent,
    TableComponent,
    PipeModule
  ]
})
export class FeatureModule { }
