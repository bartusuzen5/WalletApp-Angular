import { Directive, Input, HostListener, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidation]',
  standalone: true
})
export class ValidationDirective implements OnInit {
  @Input() minlength: number;
  @Input() maxlength: number;
  @Input() appValidation: boolean;

  private defaultMessages = {
    minlength: 'Bu alan en az {{minLength}} karakter olmalıdır!',
    maxlength: 'Bu alan en fazla {{maxLength}} karakter olmalıdır!',
    required: 'Bu alan zorunludur!'
  };

  private isFocused = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    this.control.statusChanges?.subscribe(() => {
      if (this.isFocused) {
        this.showValidationMessages();
      }
    });
  }

  @HostListener('focus') onFocus(): void {
    this.isFocused = true;
    this.showValidationMessages();
  }

  @HostListener('blur') onBlur(): void {
    this.isFocused = false;
    this.clearErrorMessages();
  }

  private showValidationMessages(): void {
    const control = this.control.control;
    const errorMessages = this.getErrorMessages(control.errors);
    this.updateErrorMessages(errorMessages);
  }

  private getErrorMessages(errors: any): string[] {
    if (!errors) return [];

    const messages: string[] = [];

    if (errors?.minlength) {
      let message = this.defaultMessages.minlength.replace('{{minLength}}', this.minlength.toString());
      messages.push(message);
    }

    if (errors?.maxlength) {
      let message = this.defaultMessages.maxlength.replace('{{maxLength}}', this.maxlength.toString());
      messages.push(message);
    }

    if (errors?.required) {
      let message = this.defaultMessages.required;
      messages.push(message);
    }

    return messages;
  }

  private updateErrorMessages(messages: string[]): void {
    this.clearErrorMessages();

    if (messages.length > 0) {
      const errorElement = this.renderer.createElement('div');
      errorElement.classList.add('text-danger');
      errorElement.innerHTML = messages.join('<br>');
      this.renderer.appendChild(this.el.nativeElement.parentNode, errorElement);
    }
  }

  private clearErrorMessages(): void {
    const existingMessages = this.el.nativeElement.nextElementSibling;
    if (existingMessages) {
      this.renderer.removeChild(this.el.nativeElement.parentNode, existingMessages);
    }
  }
}