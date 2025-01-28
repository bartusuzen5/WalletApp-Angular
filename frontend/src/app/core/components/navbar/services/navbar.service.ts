import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  public updateNavbar: EventEmitter<void> = new EventEmitter<void>();

  triggerUpdate() {
    this.updateNavbar.emit();
  }
}
