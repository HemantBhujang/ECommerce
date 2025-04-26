import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = 'http://localhost:5000/api/checkout';
  
    constructor(private http: HttpClient) {}
  
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('authToken');
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });


    }

    getcheckOut() {
      const headers = this.getAuthHeaders();
      return this.http.get(`${this.baseUrl}/init`, { headers });
    }
    getOrderSummary(){
      const headers =this.getAuthHeaders();
      return this.http.get(`${this.baseUrl}/order-summary`,{headers})
    }
  
  
}
