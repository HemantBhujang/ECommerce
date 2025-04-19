import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/Services/login.service';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';

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
  private cartSubscription!: Subscription;

  constructor(
    public loginService: LoginService, 
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Load user data if logged in
    if (this.loginService.isLoggedIn()) {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        console.log("Navbar User:", this.user); // Debug info
      }
    }

    // Subscribe to cart changes to update the cart badge count
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      // Calculate the total number of items (considering quantities)
      this.cartItemCount = items.reduce((total, item) => {
        return total + (item.quantity || 1);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onProfileClick() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
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