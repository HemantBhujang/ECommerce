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
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  products: any[] = [];
  category = '';
  parent = '';
  sub = '';
  isLoading= true;
  dbCartProductIds: number[] = [];

  constructor(private route: ActivatedRoute, 
    private productService: ProductService,
     private router: Router,
    private cartService : CartService,
  private loginService : LoginService,
private dbCartService : DatabaseCartService,
private wishlistService : WishlistService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.parent = params['parent'];
      this.sub = params['sub'];

      // Optionally, you can call a method here to load/filter products
      this.loadProducts();
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

  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      // Filter products by sub-category match
      this.products = data.filter((product: any) => 
        product.category.toLowerCase() === this.category &&
        product.parent_category.toLowerCase().replace(/\s+/g, '') === this.parent &&
        product.sub_category.toLowerCase().replace(/\s+/g, '') === this.sub
      );
    });
  }
  goToDetails(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  addToCart(product: Product) {
    const quantity = 1;
  
    if (this.loginService.isLoggedIn()) {
      const token = this.loginService.getToken();
      if (token) {
        this.dbCartService.addToCart(product.id!, quantity, token).subscribe({
          next: (response) => {
            console.log('Item added to DB cart', response);
            this.dbCartProductIds.push(product.id!); // Add to local list immediately
          },
          error: (err) => console.error('Error adding to DB cart', err)
        });
      }
    } else {
      this.cartService.addToCart({ ...product, quantity });
      // Update local tracking for non-logged in users
      this.dbCartProductIds.push(product.id!);
    }
  }
  
  isInCart(productId: number): boolean {
    return this.dbCartProductIds.includes(productId);
  }
    
      goToCart() {
        this.router.navigate(['/cart']);
      }
      toggleWishlist(product: Product) {
        this.wishlistService.toggleWishlistItem(product);
      }
      isInWishlist(productId: number): boolean {
        return this.wishlistService.isProductInWishlist(productId);
      }
  
}
