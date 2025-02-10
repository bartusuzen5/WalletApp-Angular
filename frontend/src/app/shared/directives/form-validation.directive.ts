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
  @Input() pattern: string;
  @Input() email: boolean;

  private defaultMessages = {
    minlength: 'Bu alan en az {{minLength}} karakter olmalıdır!',
    maxlength: 'Bu alan en fazla {{maxLength}} karakter olmalıdır!',
    required: 'Bu alan zorunludur!',
    email: 'Uygun email formatı giriniz',
    pattern: 'En az 8 karakter, 1 büyük harf ve 1 rakam içermeli',
  };

  private isFocused = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    this.control.valueChanges?.subscribe(() => {
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
    const errorMessages = this.getErrorMessages(control.errors, this.control.value);
    this.updateErrorMessages(errorMessages);
  }

  private getErrorMessages(errors: any, value:any): string[] {
    if (!errors) return [];

    const messages: string[] = [];

    if (errors?.minlength) {
      const message = this.defaultMessages.minlength.replace('{{minLength}}', this.minlength.toString());
      messages.push(message);
    }

    if (errors?.maxlength) {
      const message = this.defaultMessages.maxlength.replace('{{maxLength}}', this.maxlength.toString());
      messages.push(message);
    }

    if (errors?.required) {
      messages.push(this.defaultMessages.required);
    }

    if (errors?.pattern && !this.email) {
      messages.push(this.defaultMessages.pattern);
    }

    if (errors?.email && this.email) {
      messages.push(this.defaultMessages.email);
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