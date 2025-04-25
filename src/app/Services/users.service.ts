import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = 'http://localhost:5000/api/users/admin/users';

 constructor(private http: HttpClient) {}


  private getAuthHeaders(): HttpHeaders {
     const token = localStorage.getItem('adminToken');
     return new HttpHeaders({
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     });
   }

   getUsers() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}`, { headers });
  }
}
