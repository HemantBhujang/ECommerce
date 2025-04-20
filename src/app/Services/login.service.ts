import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = "http://localhost:5000/api/auth/register";
  private loginurl = "http://localhost:5000/api/auth/login";
  private logoutUrl = "http://localhost:5000/api/auth/logout";
  
  // New Subject for auth state changes
  public authStateChanged = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  userSignUp(data: any) {
    return this.http.post(this.url, data);
  }

  login(data: any) {
    return this.http.post(this.loginurl, data).pipe(
      tap((res: any) => {
        if (res.token) {
          this.setToken(res.token);
          localStorage.setItem('authUser', JSON.stringify(res.user));
          // Emit auth state change
          this.authStateChanged.next(true);
        }
      })
    );
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
    // Clear local storage before server call in case it fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    
    // Emit auth state change
    this.authStateChanged.next(false);
    
    // Continue with server logout
    return this.http.get(this.logoutUrl, { withCredentials: true });
  }
}