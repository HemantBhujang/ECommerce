// src/app/components/wishlist/wishlist.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { CartService } from 'src/app/Services/cart.service';
import { Product } from '../interface/product.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  isInCart(productId: number): boolean {
    return this.cartService.isProductInCart(productId);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}