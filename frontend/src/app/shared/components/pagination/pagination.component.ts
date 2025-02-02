import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit{

  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<{ currentPage: number, itemsPerPage: number }>();

  itemsPerPage: number = 10;
  pagesToShow: number = 3;

  totalPages: number = 0;
  displayedPages: number[] = []

  Math = Math;

  ngOnInit(): void {
    this.calculatePagination();
    this.pageChanged.emit({
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage
    });
  }

  ngOnChanges(): void {
    this.calculatePagination();
  }
  
  calculatePagination(){
    this.totalPages = Math.ceil(this.totalItems/this.itemsPerPage)
    this.calculateDisplayedPages()
  }

  calculateDisplayedPages(): void {
    const startPage = Math.max(1, this.currentPage - Math.floor(this.pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1);

    this.displayedPages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.displayedPages.push(i);
    }
  }

  goToPage(page: number){
    if (page < 1 || page > this.totalPages){
      return
    }
    this.currentPage = page;
    this.pageChanged.emit({
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage
    });
  }

  onItemsPerPageChange(){
    this.currentPage = 1
    this.calculatePagination();
    this.goToPage(this.currentPage);
  }

  onFilteredItems(eventData: { totalFilteredItems: number}){
    this.totalItems = eventData.totalFilteredItems
    this.calculatePagination()
  }
}
