// wishlist.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { CartService } from 'src/app/Services/cart.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  paginatedItems: any[] = [];
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    public router: Router,
    private loginService: LoginService,
    private dbcartService: DatabaseCartService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    
    // Get wishlist items - either from localStorage or server based on login state
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
      this.totalItems = items.length;
      this.calculateTotalPages();
      this.updatePaginatedItems();
      this.isLoading = false;
    });
  }

  removeFromWishlist(product: any): void {
    this.wishlistService.toggleWishlistItem(product);
  }

  addToCart(product: any): void {
    if (this.loginService.isLoggedIn()) {
      const token = this.loginService.getToken();
      if (token) {
        // User is logged in -> add to database
        this.dbcartService.addToCart(product.id, product.quantity, token).subscribe({
          next: () => {
            console.log('Product added to cart in database');
            this.removeFromWishlist(product);
          },
          error: (error) => {
            console.error('Error adding to database cart', error);
          }
        });
      }
    } else {
      // User not logged in -> add to local storage cart
      this.cartService.addToCart(product);
      console.log('Product added to local cart');
      this.removeFromWishlist(product);
    }
  }
    
  goToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  goToShop(): void {
    this.router.navigate(['/']);
  }

  // Pagination methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  updatePaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.paginatedItems = this.wishlistItems.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Generate page numbers array for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to maxVisiblePages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end page numbers
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      // Adjust if at the beginning
      if (this.currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(4, this.totalPages - 1);
      }
      
      // Adjust if near the end
      if (this.currentPage >= this.totalPages - 2) {
        startPage = Math.max(2, this.totalPages - 3);
        endPage = this.totalPages - 1;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < this.totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(this.totalPages);
    }
    
    return pages;
  }
}