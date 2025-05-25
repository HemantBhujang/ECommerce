import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/components/interface/product.model';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
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
          alert('Product deleted successfully');
          this.router.navigate(['/admin/product']);
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
    this.router.navigate(['/admin/add-product']);
  }
}
