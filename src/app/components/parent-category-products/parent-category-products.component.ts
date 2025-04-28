import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { finalize } from 'rxjs';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WishlistService } from 'src/app/Services/wishlist.service';

@Component({
  selector: 'app-parent-category-products',
  templateUrl: './parent-category-products.component.html',
  styleUrls: ['./parent-category-products.component.css']
})
export class ParentCategoryProductsComponent implements OnInit {
  category: string = '';
  parent: string = '';
  products: any[] = [];
  isLoading = true;
  dbCartProductIds: number[] = [];

  constructor(private route: ActivatedRoute,
     private productService: ProductService,
     private router : Router,
    private cartService : CartService,
  private loginService : LoginService,
private dbCartService : DatabaseCartService,
private wishlistService : WishlistService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.parent = params['parent'];

      this.productService.getAllProducts().subscribe((data: any[]) => {
        this.products = data.filter(product =>
          product.category.toLowerCase() === this.category.toLowerCase() &&
          product.parent_category.toLowerCase().replace(/\s+/g, '') === this.parent.toLowerCase()
        );
      });
    });

    this.loadCartItems();
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
    // Same as in HomeComponent
    this.router.navigate(['/product-details', id]);
  }
   addToCart(product: Product) {
      this.cartService.addToCart(product);
    }
  
    isInCart(productId: number): boolean {
      return this.dbCartProductIds.includes(productId);
    }
    toggleWishlist(product: Product) {
      this.wishlistService.toggleWishlistItem(product);
    }
    isInWishlist(productId: number): boolean {
      return this.wishlistService.isProductInWishlist(productId);
    }
  
    goToCart() {
      this.router.navigate(['/cart']);
    }
}
