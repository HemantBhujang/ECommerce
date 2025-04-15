// admin-products.component.ts
import { Component, OnInit } from '@angular/core';

import { Product } from '../../interface/product.model';
import { ProductService } from 'src/app/Services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router : Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Failed to fetch products:', err);
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (res) => {
          console.log('Deleted:', res);
          // Instantly update UI
          this.products = this.products.filter(p => p.id !== productId);
        },
        error: (err) => {
          console.error('Failed to delete product:', err);
          alert('Error deleting product');
        }
      });
    }
  }
  
  addNewProduct(): void {
    this.router.navigate(['/adminDashboard/addproducts'])
  }
}
