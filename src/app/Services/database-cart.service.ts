import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../components/interface/product.model';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseCartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  
  // Subject to notify components when cart is updated
  private cartUpdatedSubject = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  addToCart(productId: number, quantity: number, token: string): Observable<any> {
    const body = {
      product_id: productId,
      quantity: quantity
    };
    return this.http.post(`${this.apiUrl}/cartadd`, body, this.getAuthHeaders(token))
      .pipe(
        tap(() => {
          // Notify subscribers that cart has been updated
          this.cartUpdatedSubject.next();
          console.log('Item added to cart:', body);
          
        })
      );
  }

  getCartItems(token: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/cartget`, this.getAuthHeaders(token));
  }

  removeFromCart(itemId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cartdel/${itemId}`, this.getAuthHeaders(token))
      .pipe(
        tap(() => {
          // Notify subscribers that cart has been updated
          this.cartUpdatedSubject.next();
        })
      );
  }
  
  // Call this method manually if you need to notify components that cart data has changed
  notifyCartUpdated(): void {
    this.cartUpdatedSubject.next();
  }
}