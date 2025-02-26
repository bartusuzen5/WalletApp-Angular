import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  providers: [
    DatePipe
  ]
})
export class SharedModule { }
