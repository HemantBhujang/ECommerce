import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminOrderService {
  private url = 'http://localhost:5000/api/orders/admin/orders';
  
  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
  getAllOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.url, { headers });
  }
  
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.url}/${orderId}/status`, { status }, { headers });
  }
}