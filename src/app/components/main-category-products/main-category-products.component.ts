import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { finalize } from 'rxjs';
import { WishlistService } from 'src/app/Services/wishlist.service';

@Component({
  selector: 'app-main-category-products',
  templateUrl: './main-category-products.component.html',
  styleUrls: ['./main-category-products.component.css']
})
export class MainCategoryProductsComponent implements OnInit {
  category = '';
  products: any[] = [];
  validCategories = ['men', 'women', 'kids']; // Define valid categories
  isLoading = true;
  dbCartProductIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService : CartService,
    private loginService : LoginService,
    private dbCartService : DatabaseCartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      
      // Check if the category is valid
      if (!this.validCategories.includes(this.category.toLowerCase())) {
        this.router.navigate(['/not-found']);
        return;
      }
      
      this.loadCategoryProducts();

      this.loadCartItems();
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

  loadCategoryProducts() {
    this.productService.getAllProducts().subscribe((data: any[]) => {
      this.products = data.filter(product =>
        product.category.toLowerCase() === this.category.toLowerCase()
      );
    });
  }
  toggleWishlist(product: Product) {
    this.wishlistService.toggleWishlistItem(product);
  }
  goToDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }
   addToCart(product: Product) {
      this.cartService.addToCart(product);
    }
    isInWishlist(productId: number): boolean {
      return this.wishlistService.isProductInWishlist(productId);
    }
  
    isInCart(productId: number): boolean {
      return this.dbCartProductIds.includes(productId);
    }
    
  
    goToCart() {
      this.router.navigate(['/cart']);
    }
    showMoreNewArrivals(): void {
      this.router.navigate(['/category'], { 
        queryParams: { filter: 'new-arrivals' } 
      });
    }
}