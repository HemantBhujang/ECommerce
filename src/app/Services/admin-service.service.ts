import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private apiUrl = 'https://shop-backend-eyqo.onrender.com/api/admin'; // Backend endpoint

  constructor(private http: HttpClient, private router: Router) {}

  loginAdmin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true // Important for sending cookies
    });
  }

  storeToken(token: string): void {
    localStorage.setItem('adminToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    this.router.navigate(['/admin/login']);
  }
}
