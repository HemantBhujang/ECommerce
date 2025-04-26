import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';  // Your backend URL

  constructor(private http: HttpClient) {}

  // Get order data for summary
  getOrderData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/${userId}`);
  }

  // Create order and send data to backend
  createOrder(orderData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer YOUR_AUTH_TOKEN`  // Add token or use session if necessary
    });

    return this.http.post<any>(`${this.apiUrl}/create`, orderData, { headers });
  }
}