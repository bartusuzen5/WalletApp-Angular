import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../features/category/services/category.service';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { RouterModule } from '@angular/router';
import { CategoryModel } from '../../../features/category/models/category.model';
import { SidebarService } from './services/sidebar.service';
import { IfAdminDirective } from '../../../shared/directives/if-admin.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IfAdminDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  categories: CategoryModel[] = [];

  constructor(
    private _category: CategoryService,
    private _apiSubscriber: ApiSubscriberService,
    private _sidebar: SidebarService
  ){}  

  ngOnInit(): void {
    this._sidebar.updateSidebar.subscribe(() => {
      this.getCategories()
    });
    this.getCategories();
  }

  getCategories(){
    this._apiSubscriber.Api('get',
      this._category.getAll(),
      (response) => {
        this.categories = response;
      }
    )
  }
}
