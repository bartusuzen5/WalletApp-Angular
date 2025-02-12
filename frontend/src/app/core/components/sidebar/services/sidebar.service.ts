import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public updateSidebar: EventEmitter<void> = new EventEmitter<void>();
  
  triggerUpdate() {
    this.updateSidebar.emit();
  }
}
