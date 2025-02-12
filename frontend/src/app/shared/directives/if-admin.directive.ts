import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appIfAdmin]',
  standalone: true
})
export class IfAdminDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    if (this._auth.getUserRole() === 'admin') {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
