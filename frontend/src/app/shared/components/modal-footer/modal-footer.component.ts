import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-footer.component.html',
  styleUrl: './modal-footer.component.css'
})
export class ModalFooterComponent {
  @Input() isDisabled: boolean = false
  @Input() form: NgForm

  formReset(){
    this.form.reset()
  }
}
