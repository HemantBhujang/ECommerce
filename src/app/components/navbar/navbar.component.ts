import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/Services/login.service';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  user: any = null;
  searchResult: any = [];
  cartItemCount: number = 0;
  wishlistItemCount: number = 0;
  
  private cartSubscription!: Subscription;
  private wishlistSubscription!: Subscription;
  private authStateSubscription!: Subscription;
  private dbCartUpdateSubscription!: Subscription;

  constructor(
    public loginService: LoginService, 
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private databaseCartService: DatabaseCartService
  ) {}

  ngOnInit(): void {
    // Check initial login status and load appropriate data
    this.checkLoginAndLoadData();
    
    // Subscribe to authentication state changes
    this.authStateSubscription = this.loginService.authStateChanged.subscribe(isLoggedIn => {
      // Immediately update cart count when auth state changes
      setTimeout(() => this.checkLoginAndLoadData(), 0); // Use setTimeout to ensure token is set
    });
    
    // Subscribe to database cart updates
    this.dbCartUpdateSubscription = this.databaseCartService.cartUpdated$.subscribe(() => {
      if (this.loginService.isLoggedIn()) {
        const token = this.loginService.getToken();
        if (token) {
          this.loadDatabaseCartItems(token);
        }
      }
    });
    
    // Subscribe to wishlist changes to update the wishlist badge count
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItemCount = items.length;
    });
    
    // For logged out users, we'll still listen to local cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      if (!this.loginService.isLoggedIn()) {
        // Only update from local storage if not logged in
        this.cartItemCount = items.reduce((total, item) => {
          return total + (item.quantity || 1);
        }, 0);
      }
    });
  }

  private checkLoginAndLoadData(): void {
    if (this.loginService.isLoggedIn()) {
      // User is logged in
      const storedUser = localStorage.getItem('authUser');
      const token = this.loginService.getToken();
      
      if (storedUser && token) {
        this.user = JSON.parse(storedUser);
        console.log("Navbar User:", this.user);
        
        // Fetch cart items from database
        this.loadDatabaseCartItems(token);
      }
    } else {
      // User is logged out, use local storage cart
      this.user = null;
      const items = this.cartService.getCartItems();
      this.cartItemCount = items.reduce((total, item) => {
        return total + (item.quantity || 1);
      }, 0);
    }
  }

  private loadDatabaseCartItems(token: string): void {
    this.databaseCartService.getCartItems(token).subscribe({
      next: (items) => {
        // Calculate total quantity from database items
        this.cartItemCount = items.reduce((total, item: any) => {
          return total + (item.quantity || 1);
        }, 0);
      },
      error: (error) => {
        console.error('Error fetching cart items from database:', error);
        // Fall back to local storage if database fetch fails
        const localItems = this.cartService.getCartItems();
        this.cartItemCount = localItems.reduce((total, item) => {
          return total + (item.quantity || 1);
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions when component is destroyed
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
    
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    
    if (this.dbCartUpdateSubscription) {
      this.dbCartUpdateSubscription.unsubscribe();
    }
  }

  // Navigate to wishlist - no login check needed
  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  onProfileClick() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/']);
      }
    });
  }

  goToProfile() {
    this.router.navigate(['/userProfile']);
  }

  editProfile() {
    if (this.user && this.user.id) {
      this.router.navigate([`/edit-profile/${this.user.id}`]);
      console.log("userId", this.user.id);
    } else {
      console.warn("User not logged in or ID not available");
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  searchProduct(query: Event) {
    if (query) {
      const element = (query.target as HTMLInputElement).value;
      console.log(element);

      if (!element) {
        this.searchResult = []; // Clear search results if input is empty
        return;
      }

      this.productService.searchProduct(element).subscribe((result: any) => {
        this.searchResult = result;
      });
    }
  }

  goToProduct(productId: number) {
    this.searchResult = []; // Clear results after navigation
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; // Clear input field
    }
    this.router.navigate(['/product-details', productId]);
  }
}