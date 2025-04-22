import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../components/interface/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseCartService {
  private apiUrl = 'http://localhost:5000/api/cart';
  

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
    return this.http.post(`${this.apiUrl}/cartadd`, body, this.getAuthHeaders(token));
  }

  getCartItems(token: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/cartget`, this.getAuthHeaders(token));
  }

  removeFromCart(itemId: number, token: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cartdel/${itemId}`, this.getAuthHeaders(token));
  }

  
}
