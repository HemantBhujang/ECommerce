import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { finalize } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

interface Collection {
  name: string;
  path: string;
  image: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: any[] = [];
  dbCartProductIds: number[] = [];
  isLoading = true;
  
  // New properties for enhanced UI
  newArrivals: Product[] = [];
  trendingProducts: Product[] = [];
  dealOfTheDay: Product | null = null;
  // Countdown timer
  countdownHours: string = '00';
  countdownMinutes: string = '00';
  countdownSeconds: string = '00';
  private countdownSubscription?: Subscription;
  private endTime: Date = new Date();

  constructor(
    private router: Router, 
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private loginService: LoginService,
    private dbCartService: DatabaseCartService
  ) {}

  ngOnInit(): void {
    // Load products and cart status in parallel
    this.loadProducts();
    this.loadCartItems();
    this.initializeCountdown();
  }
  
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  initializeCountdown(): void {
    // Set the end time to 24 hours from now
    this.endTime = new Date();
    this.endTime.setHours(this.endTime.getHours() + 24);
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }
  
  updateCountdown(): void {
    const now = new Date();
    const diff = this.endTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      // Reset timer for the next day
      this.endTime = new Date();
      this.endTime.setHours(this.endTime.getHours() + 24);
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    this.countdownHours = hours.toString().padStart(2, '0');
    this.countdownMinutes = minutes.toString().padStart(2, '0');
    this.countdownSeconds = seconds.toString().padStart(2, '0');
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.organizeCategories();
      this.setupProductSections();
    });
  }

  setupProductSections(): void {
    // Sort products to get newest items (could use date field if available)
    this.newArrivals = [...this.products]
      .sort((a, b) => b.id! - a.id!)  // Assuming higher IDs mean newer products
      .slice(0, 4);  // Show only 4 items

    // For trending, choose products with highest discount rates
    this.trendingProducts = [...this.products]
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 4);  // Show only 4 items

    // Select deal of the day (product with max discount)
    this.dealOfTheDay = [...this.products]
      .sort((a, b) => b.discount - a.discount)[0];
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
  organizeCategories(): void {
    const grouped: any = {};
  
    this.products.forEach(product => {
      const { category, parent_category, sub_category, image } = product;
  
      if (!grouped[category]) {
        grouped[category] = {
          name: category,
          img: image,
          path: category.toLowerCase(),
          hasSubcategories: true,
          subcategories: []
        };
      }
  
      const parentExists = grouped[category].subcategories.find((p: any) => p.name === parent_category);
      if (!parentExists) {
        grouped[category].subcategories.push({
          name: parent_category,
          path: `${category.toLowerCase()}/${parent_category.toLowerCase().replace(/\s+/g, '')}`,
          children: []
        });
      }
  
      const parentIndex = grouped[category].subcategories.findIndex((p: any) => p.name === parent_category);
      const childExists = grouped[category].subcategories[parentIndex].children.find(
        (c: any) => c.name === sub_category
      );
  
      if (!childExists) {
        grouped[category].subcategories[parentIndex].children.push({
          name: sub_category,
          path: `${category.toLowerCase()}/${parent_category.toLowerCase().replace(/\s+/g, '')}/${sub_category.toLowerCase().replace(/\s+/g, '')}`
        });
      }        
    });
  
    this.categories = Object.values(grouped);
  }

  productDetailsPage(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  getCategoryImage(categoryName: string): string {
    switch (categoryName.toLowerCase()) {
      case 'men':
        return 'https://tse1.mm.bing.net/th?id=OIP.dmQRXWusIlb_auYpgBDx8wHaKd&pid=Api&P=0&h=180';
      case 'women':
        return 'https://tse2.mm.bing.net/th?id=OIP.aLcChT8Y2gUkeiDMQQpCHAHaJl&pid=Api&P=0&h=180';
      case 'kids':
        return 'https://tse1.mm.bing.net/th?id=OIP.la9Z6d3qwEIH77kmkaZQxwHaFs&pid=Api&rs=1&c=1&qlt=95&w=149&h=114';
      default:
        return 'https://via.placeholder.com/60';
    }
  }

  navigateCategory(path: string) {
    // this.router.navigate(['/category',path]);
    this.router.navigate([path]);

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
 showMoreNewArrivals(): void {
    this.router.navigate(['/category'], { 
      queryParams: { filter: 'new-arrivals' } 
    });
  }
  
  showMoreTrending(): void {
    this.router.navigate(['/category'], { 
      queryParams: { filter: 'trending' } 
    });
  }
}