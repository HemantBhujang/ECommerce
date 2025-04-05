// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = "http://localhost:5000/api/auth/register";
  private loginurl = "http://localhost:5000/api/auth/login";

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

  logout(): void {
    localStorage.removeItem('authToken');
  }

  setUser(user: any) {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
  
  getUser() {
    const userJson = localStorage.getItem('authUser');
    return userJson ? JSON.parse(userJson) : null;
  }
  
  
}
