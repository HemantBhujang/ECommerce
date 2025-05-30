import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = 'https://shop-backend-eyqo.onrender.com/api/checkout';
  
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

    getOneProductOrderSummary(id:number){
      const headers =this.getAuthHeaders();
      return this.http.get(`${this.baseUrl}/order-summary?productId=${id}`,{headers})
    }
  
  
}
