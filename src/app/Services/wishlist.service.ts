import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../components/interface/product.model';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5000/api/wishlist';
  private wishlistItemsSubject = new BehaviorSubject<any[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    // Initialize wishlist on service startup
    this.initializeWishlist();

    // Subscribe to login state changes
    this.loginService.authStateChanged.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        // User just logged in, fetch from server
        this.fetchWishlistFromServer().subscribe();
      } else {
        // User just logged out, switch to local storage
        const localItems = this.getLocalWishlist();
        this.wishlistItemsSubject.next(localItems);
      }
    });
  }

  // Initialize wishlists based on login state
  private initializeWishlist(): void {
    if (this.loginService.isLoggedIn()) {
      this.fetchWishlistFromServer().subscribe();
    } else {
      const localItems = this.getLocalWishlist();
      this.wishlistItemsSubject.next(localItems);
    }
  }

  // Get wishlist from localStorage
  private getLocalWishlist(): any[] {
    const storedItems = localStorage.getItem('wishlistItems');
    return storedItems ? JSON.parse(storedItems) : [];
  }

  // Save wishlist to localStorage (for guest users)
  private saveToLocalStorage(items: any[]): void {
    localStorage.setItem('wishlistItems', JSON.stringify(items));
  }

  // Fetch wishlist from server (for logged-in users)
  private fetchWishlistFromServer(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/wishlistget`, { headers }).pipe(
      tap(response => {
        // Map the response to match our frontend format if needed
        let mappedItems = response;
        
        // If response is an array of objects with product property
        if (response.length > 0 && response[0].product) {
          mappedItems = response.map(item => ({
            ...item,
            wishlist_item_id: item.wishlist_item_id,
            quantity: item.quantity || 1
          }));
        }
        
        // Update the BehaviorSubject
        this.wishlistItemsSubject.next(mappedItems);
      }),
      catchError(error => {
        console.error('Server wishlist fetch error:', error);
        return of([]);
      })
    );
  }

  // Toggle an item in wishlist (add or remove)
  toggleWishlistItem(product: Product): void {
    if (this.loginService.isLoggedIn()) {
      // Logged-in user - use server API
      if (this.isProductInWishlist(product.id!)) {
        // Remove item
        this.removeFromServerWishlist(product).subscribe({
          next: () => {
            const currentItems = this.wishlistItemsSubject.value;
            const updatedItems = currentItems.filter(item => item.id !== product.id);
            this.wishlistItemsSubject.next(updatedItems);
          },
          error: err => console.error('Error removing from wishlist:', err)
        });
      } else {
        // Add item
        this.addToServerWishlist(product.id!).subscribe({
          next: () => {
            const currentItems = this.wishlistItemsSubject.value;
            const updatedItems = [...currentItems, product];
            this.wishlistItemsSubject.next(updatedItems);
          },
          error: err => console.error('Error adding to wishlist:', err)
        });
      }
    } else {
      // Guest user - use localStorage
      const currentItems = this.wishlistItemsSubject.value;
      const existingIndex = currentItems.findIndex(item => item.id === product.id);
      
      let updatedItems: any[];
      
      if (existingIndex >= 0) {
        // Remove item
        updatedItems = currentItems.filter(item => item.id !== product.id);
      } else {
        // Add item
        updatedItems = [...currentItems, product];
      }
      
      this.wishlistItemsSubject.next(updatedItems);
      this.saveToLocalStorage(updatedItems);
    }
  }

  // Add item to server wishlist
  private addToServerWishlist(productId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.loginService.getToken()}`
    });

    return this.http.post(`${this.apiUrl}/wishlistadd`, {
      product_id: productId,
      quantity: 1
    }, { headers });
  }

  // Remove item from server wishlist
  private removeFromServerWishlist(product: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.loginService.getToken()}`
    });
  
    const wishlistItemId = product.wishlist_item_id;
    return this.http.delete(`${this.apiUrl}/wishlistdel/${wishlistItemId}`, { headers });
  }

  // Check if a product is in wishlist
  isProductInWishlist(productId: number): boolean {
    return this.wishlistItemsSubject.value.some(item => item.id === productId);
  }

  // Get all wishlist items
  getWishlistItems(): any[] {
    return this.wishlistItemsSubject.value;
  }

  // Clear wishlist
  clearWishlist(): void {
    if (this.loginService.isLoggedIn()) {
      // Server-side wishlist clearing would go here if API supports it
      // For now, just clear the local state
      this.wishlistItemsSubject.next([]);
    } else {
      this.wishlistItemsSubject.next([]);
      localStorage.removeItem('wishlistItems');
    }
  }
}