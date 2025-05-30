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
  private apiUrl = 'https://shop-backend-eyqo.onrender.com/api/wishlist';
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
        console.log('Wishlist server response:', response);
        let mappedItems = [];
        
        // If response is an array of objects with product property
        if (response.length > 0) {
          if (response[0].product) {
            // Case where each item has a product property
            mappedItems = response.map(item => ({
              ...item.product,  // Spread all product properties
              wishlist_item_id: item.wishlist_item_id,  // Add the wishlist item ID
              quantity: item.quantity || 1
            }));
          } else {
            // Case where we might have a flatter structure
            mappedItems = response.map(item => ({
              ...item,
              wishlist_item_id: item.wishlist_item_id,
              quantity: item.quantity || 1
            }));
          }
        }
        
        console.log('Mapped wishlist items:', mappedItems);
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
      const currentItems = this.wishlistItemsSubject.value;
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem && existingItem.wishlist_item_id) {
        // Remove item - use the wishlist_item_id from the existing item
        console.log('Removing wishlist item with ID:', existingItem.wishlist_item_id);
        
        this.removeFromServerWishlist(existingItem).subscribe({
          next: () => {
            const updatedItems = currentItems.filter(item => item.id !== product.id);
            this.wishlistItemsSubject.next(updatedItems);
          },
          error: err => console.error('Error removing from wishlist:', err)
        });
      } else {
        // Add item
        this.addToServerWishlist(product.id!).subscribe({
          next: (response) => {
            console.log('Added to wishlist response:', response);
            
            // After adding to server, fetch the updated wishlist to get the correct IDs
            this.fetchWishlistFromServer().subscribe();
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
// Modify the addToServerWishlist method to handle the response better
private addToServerWishlist(productId: number): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.loginService.getToken()}`
  });

  return this.http.post(`${this.apiUrl}/wishlistadd`, {
    product_id: productId,
    quantity: 1
  }, { headers }).pipe(
    tap(response => {
      console.log('Add to wishlist response:', response);
    })
  );
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