import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../components/interface/product.model';
import { AdminServiceService } from './admin-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/products';

  constructor(
    private http: HttpClient,
    private authService: AdminServiceService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('token being used:', token);
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
  
  getProductsByCategory(category: string, parentCategory: string, subCategory: string): Observable<Product[]> {
    let url = `${this.apiUrl}/filter?category=${category}`;
    
    if (parentCategory) {
      url += `&parent_category=${parentCategory}`;
    }
    
    if (subCategory) {
      url += `&sub_category=${subCategory}`;
    }
    
    return this.http.get<Product[]>(url);
  }
  
  createProduct(product: Product): Observable<Product> {
    const headers = this.getHeaders();
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const headers = this.getHeaders();
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  searchProduct(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search?keyword=${query}`);
  }
  
  getFirstEightProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?_limit=8`);
  }
}