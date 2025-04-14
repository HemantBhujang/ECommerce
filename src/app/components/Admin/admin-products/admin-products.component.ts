import { Component } from '@angular/core';
import { Product } from '../../interface/product.model';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Premium Widget',
      description: 'High-quality widget with premium features for professional use.',
      old_price: '159.99',
      discount_price: '129.99',
      discount: 18,
      category: 'Widgets',
      parent_category: 'Hardware',
      sub_category: 'Professional',
      stock: 12,
      image: 'assets/images/product1.jpg',
      size: 'Medium',
      color: 'Silver',
      quantity: 1,
      created_at: '2024-08-01T10:00:00Z'
    },
    {
      id: 2,
      name: 'Deluxe Package',
      description: 'Complete package with all accessories and premium support.',
      old_price: '349.99',
      discount_price: '299.50',
      discount: 14,
      category: 'Packages',
      parent_category: 'Bundles',
      sub_category: 'Deluxe',
      stock: 5,
      image: 'assets/images/product2.jpg',
      size: 'Large',
      color: 'Black',
      quantity: 1,
      created_at: '2024-08-02T11:00:00Z'
    },
    {
      id: 3,
      name: 'Standard Widget',
      description: 'Reliable widget for everyday use with standard features.',
      old_price: '89.99',
      discount_price: '79.99',
      discount: 11,
      category: 'Widgets',
      parent_category: 'Hardware',
      sub_category: 'Standard',
      stock: 20,
      image: 'assets/images/product3.jpg',
      size: 'Small',
      color: 'White',
      quantity: 1,
      created_at: '2024-08-03T12:00:00Z'
    },
    {
      id: 4,
      name: 'Premium Service',
      description: 'Advanced service with personalized support and priority handling.',
      old_price: '179.99',
      discount_price: '149.99',
      discount: 17,
      category: 'Services',
      parent_category: 'Support',
      sub_category: 'Premium',
      stock: 100,
      image: 'assets/images/product4.jpg',
      size: 'N/A',
      color: 'N/A',
      quantity: 1,
      created_at: '2024-08-04T13:00:00Z'
    },
    {
      id: 5,
      name: 'Starter Kit',
      description: 'Perfect for beginners, includes essential items to get started.',
      old_price: '59.99',
      discount_price: '49.99',
      discount: 17,
      category: 'Kits',
      parent_category: 'Bundles',
      sub_category: 'Starter',
      stock: 0,
      image: 'assets/images/product5.jpg',
      size: 'Compact',
      color: 'Blue',
      quantity: 1,
      created_at: '2024-08-05T14:00:00Z'
    },
    {
      id: 6,
      name: 'Professional Tool',
      description: 'Industry-standard tool designed for professionals with advanced needs.',
      old_price: '249.99',
      discount_price: '199.99',
      discount: 20,
      category: 'Tools',
      parent_category: 'Hardware',
      sub_category: 'Professional',
      stock: 10,
      image: 'assets/images/product6.jpg',
      size: 'Full',
      color: 'Red',
      quantity: 1,
      created_at: '2024-08-06T15:00:00Z'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  // Helper method for formatting price
  formatPrice(price: string): string {
    return parseFloat(price).toFixed(2);
  }

  viewProduct(product: Product): void {
    console.log('Viewing product:', product);
  }

  editProduct(product: Product): void {
    console.log('Editing product:', product);
  }

  deleteProduct(productId: number): void {
    if(confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== productId);
    }
  }

  addNewProduct(): void {
    console.log('Adding new product');
  }
}
