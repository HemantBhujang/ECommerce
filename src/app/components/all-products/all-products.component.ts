import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../interface/product.model';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  dbCartProductIds: number[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  activeCategory: string = 'All';
  categories: string[] = ['All', 'Women', 'Men', 'Kids', 'Accessories'];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private loginService: LoginService,
    private dbCartService: DatabaseCartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartItems();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data; // Initially show all products
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  loadCartItems(): void {
    if (this.loginService.isLoggedIn()) {
      const token = this.loginService.getToken();
      if (token) {
        this.isLoading = true;
        this.dbCartService.getCartItems(token)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe({
            next: (items: any[]) => {
              // Extract product IDs from cart items
              this.dbCartProductIds = items.map(item => item.product?.id || item.product_id);
              console.log('Cart items loaded:', this.dbCartProductIds);
            },
            error: (err) => {
              console.error('Error loading cart items:', err);
            }
          });
      }
    } else {
      // For non-logged in users, use the local cart service
      this.dbCartProductIds = this.cartService.getCartItems().map(item => item.id!);
    }
  }

  productDetailsPage(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  toggleWishlist(product: Product) {
    this.wishlistService.toggleWishlistItem(product);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isProductInWishlist(productId);
  }

  addToCart(product: Product) {
    const quantity = 1;
    
    if (this.loginService.isLoggedIn()) {
      const token = this.loginService.getToken();
      if (token) {
        this.dbCartService.addToCart(product.id!, quantity, token).subscribe({
          next: (response) => {
            console.log('Item added to DB cart', response);
            this.dbCartProductIds.push(product.id!);
            this.showToast(`${product.name} added to cart`);
          },
          error: (err) => {
            console.error('Error adding to DB cart', err);
            this.showToast('Failed to add item to cart', true);
          }
        });
      }
    } else {
      this.cartService.addToCart({ ...product, quantity });
      // Update local tracking for non-logged in users
      this.dbCartProductIds.push(product.id!);
      this.showToast(`${product.name} added to cart`);
    }
  }

  isInCart(productId: number): boolean {
    return this.dbCartProductIds.includes(productId);
  }

  filterByCategory(category: string): void {
    this.activeCategory = category;
    
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }
  }

  // Simple toast notification
  showToast(message: string, isError: boolean = false): void {
    // This would be implemented with a toast service in a real app
    console.log(`Toast: ${message} (${isError ? 'error' : 'success'})`);
    // For demonstration purposes only - in a real app you'd use a proper toast component
    const toastDiv = document.createElement('div');
    toastDiv.className = `toast-notification ${isError ? 'toast-error' : 'toast-success'}`;
    toastDiv.textContent = message;
    document.body.appendChild(toastDiv);
    
    setTimeout(() => {
      toastDiv.classList.add('show');
      setTimeout(() => {
        toastDiv.classList.remove('show');
        setTimeout(() => document.body.removeChild(toastDiv), 300);
      }, 3000);
    }, 100);
  }
}