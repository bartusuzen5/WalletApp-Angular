import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Currency2Pipe } from '../../pipes/currency.pipe';
import { CustomNumberPipe } from '../../pipes/custom-number.pipe';
import { GenericPipe } from '../../pipes/generic.pipe';



@NgModule({
  declarations: [],
  imports: [
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe
  ],
  exports: [
    Currency2Pipe,
    CustomNumberPipe,
    GenericPipe
  ]
})
export class PipeModule { }
