// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = "http://localhost:5000/api/auth/register";
  private loginurl = "http://localhost:5000/api/auth/login";
  private logoutUrl = "http://localhost:5000/api/auth/logout";

  constructor(private http: HttpClient) { }

  userSignUp(data: any) {
    return this.http.post(this.url, data);
  }

  login(data: any) {
    return this.http.post(this.loginurl, data);
  }

  // Store token
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  logout(): Observable<any> {
    // Invalidate cookie on backend
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser')
    return this.http.get(this.logoutUrl, { withCredentials: true });
  }


  
  
}
