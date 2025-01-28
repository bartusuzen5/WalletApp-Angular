import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryModel } from '../../../features/category/models/category.model';
import { ApiSubscriberService } from '../../../shared/services/api-subscriber.service';
import { CategoryService } from '../../../features/category/services/category.service';
import { Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  categories: CategoryModel[] = [];

  constructor(
    private _category: CategoryService,
    private _apiSubscriber: ApiSubscriberService,
    private _router: Router,
    private _navbar: NavbarService
  ){}

  ngOnInit(): void {
    this._navbar.updateNavbar.subscribe(() => {
      this.getCategories()
    });
    this.getCategories();
  }

  getCategories(){
    this._apiSubscriber.getApi(
      this._category.getAll(),
      (response) => {
        this.categories = response;
      }
    )
  }

}
