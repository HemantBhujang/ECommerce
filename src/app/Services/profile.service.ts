// profile.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProfile() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }

  updateProfile(profileData: any) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/profile/update`, profileData, { headers });
  }
}
