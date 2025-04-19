// src/app/Services/wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../components/interface/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistKey = 'userWishlist';
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor() {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage(): void {
    const storedWishlist = localStorage.getItem(this.wishlistKey);
    if (storedWishlist) {
      const wishlist = JSON.parse(storedWishlist);
      this.wishlistItemsSubject.next(wishlist);
    }
  }

  private saveWishlistToStorage(items: Product[]): void {
    localStorage.setItem(this.wishlistKey, JSON.stringify(items));
    this.wishlistItemsSubject.next(items);
  }

  getWishlistItems(): Product[] {
    return this.wishlistItemsSubject.value;
  }

  addToWishlist(product: Product): void {
    const currentItems = this.getWishlistItems();
    if (!this.isProductInWishlist(product.id!)) {
      this.saveWishlistToStorage([...currentItems, product]);
    }
  }

  removeFromWishlist(productId: number): void {
    const currentItems = this.getWishlistItems();
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.saveWishlistToStorage(updatedItems);
  }

  isProductInWishlist(productId: number): boolean {
    return this.getWishlistItems().some(item => item.id === productId);
  }

  toggleWishlistItem(product: Product): void {
    if (this.isProductInWishlist(product.id!)) {
      this.removeFromWishlist(product.id!);
    } else {
      this.addToWishlist(product);
    }
  }

  clearWishlist(): void {
    this.saveWishlistToStorage([]);
  }

  getWishlistCount(): number {
    return this.getWishlistItems().length;
  }
}