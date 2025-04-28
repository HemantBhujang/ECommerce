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
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    public router: Router,
    private loginService: LoginService,
    private dbcartService : DatabaseCartService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    
    // Get wishlist items - either from localStorage or server based on login state
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
      this.isLoading = false;
    });
  }

  removeFromWishlist(product: any): void {
    this.wishlistService.toggleWishlistItem(product);
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    // Optionally remove from wishlist after adding to cart
    this.removeFromWishlist(product);
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  goToShop(): void {
    this.router.navigate(['/']);
  }
}