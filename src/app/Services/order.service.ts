// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';  // For normal orders
  private orderUrl = 'http://localhost:5000/api/onlinepay/create-order'; // For Razorpay
  private codUrl=' http://localhost:5000/api/pay/cod';
 // private userOrderUrl ='http://localhost:5000/api/orders/myorders'

  constructor(private http: HttpClient) {}

  getOrderData(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary/${userId}`);
  }

  createOrder(orderData: any): Observable<any> {
    const token = localStorage.getItem('authToken');  //  get token from localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/create`, orderData, { headers });
  }

  postOrder(products: any[], address: string): Observable<any> {
    const token = localStorage.getItem('authToken');  //  get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      products: products,
      address: address
    };

    return this.http.post<any>(this.orderUrl, payload, { headers }); // send with headers
  }

  placeOrderAfterPayment(products: any[], address: string, razorpay_order_id: string, razorpay_payment_id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const payload = {
      products,
      address,
      razorpay_order_id,
      razorpay_payment_id
    };
  
   
    return this.http.post<any>('http://localhost:5000/api/onlinepay/verify-payment', payload, { headers });
  }
  

  cashOnDelivery(products: any[], address: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const payload = {
      products,
      address
    };
  
    return this.http.post<any>(this.codUrl, payload, { headers });
  }


  getUserOrder():Observable<any> {
    const token = localStorage.getItem('authToken');  //  get token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
        return this.http.get<any>(`${this.apiUrl}/myorders`,{ headers });
  }
  

  getRazorpayKey(): Observable<{ key: string }> {
    return this.http.get<{ key: string }>('http://localhost:5000/api/onlinepay/razorpay-key');
  }
  
}
