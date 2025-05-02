import { Component, OnInit, OnDestroy, HostListener, NgZone } from '@angular/core';
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
  firstEightProducts: Product[] | undefined;
  isMobileView: boolean = false;
  activeCategory: string | null = null;
  // zone: any;

  constructor(
    private router: Router, 
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private loginService: LoginService,
    private dbCartService: DatabaseCartService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // Load products and cart status in parallel
    this.loadProducts();
    this.loadCartItems();
    this.initializeCountdown();
    this.checkScreenSize();
  }
  
    
  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.closeDropdown);
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const wasAlreadyMobile = this.isMobileView;
    this.isMobileView = window.innerWidth < 768;
    
    // If we switched from mobile to desktop view, close any active dropdown
    if (wasAlreadyMobile && !this.isMobileView && this.activeCategory) {
      this.activeCategory = null;
      document.removeEventListener('click', this.closeDropdown);
    }
  }

  handleCategoryClick(event: Event, category: any) {
    // Prevent default behavior for all screen sizes
    event.preventDefault();
    event.stopPropagation();
    
    if (this.activeCategory === category.name) {
      // If already active, navigate to the category page
      this.navigateCategory(category.path);
      this.activeCategory = null;
      document.removeEventListener('click', this.closeDropdown);
    } else {
      // If there was another active category, close it first
      if (this.activeCategory) {
        this.activeCategory = null;
        document.removeEventListener('click', this.closeDropdown);
      }
      
      // Show the dropdown for this category on all screen sizes
      setTimeout(() => {
        this.zone.run(() => {
          this.activeCategory = category.name;
          
          // Position the flyout appropriately (only needed for mobile but won't harm desktop)
          this.adjustFlyoutPosition(category.name);
          
          // Close the flyout when clicking outside
          setTimeout(() => {
            document.addEventListener('click', this.closeDropdown);
          }, 0);
        });
      }, 50);
    }
  }


  adjustFlyoutPosition(categoryName: string) {
    setTimeout(() => {
      const categoryCard = document.querySelector(`[data-category="${categoryName}"]`) as HTMLElement;
      const flyout = categoryCard?.querySelector('.category-flyout') as HTMLElement;
      
      if (categoryCard && flyout && this.isMobileView) {
        // Position the flyout relative to the viewport
        const cardRect = categoryCard.getBoundingClientRect();
        const topPosition = cardRect.bottom + window.scrollY + 10; // Add 10px spacing
        
        // Make sure the flyout is properly positioned below the category card
        flyout.style.top = `${topPosition}px`;
        flyout.style.maxHeight = `${window.innerHeight - topPosition - 20}px`;
        
        // Ensure there's enough space below
        const availableSpaceBelow = window.innerHeight - cardRect.bottom;
        if (availableSpaceBelow < 200) { // If less than 200px available
          window.scrollBy({
            top: 200 - availableSpaceBelow,
            behavior: 'smooth'
          });
        }
      }
    }, 0);
  }
  closeDropdown = (event: Event) => {
    // Check if the click is outside the active category card
    const target = event.target as HTMLElement;
    const activeCard = document.querySelector('.category-card.active');
    
    if (activeCard && !activeCard.contains(target)) {
      this.zone.run(() => {
        this.activeCategory = null;
        document.removeEventListener('click', this.closeDropdown);
      });
    }
  }

  navigateToSubcategory(event: Event, path: string) {
    event.stopPropagation();
    this.navigateCategory(path);
    this.activeCategory = null;
    document.removeEventListener('click', this.closeDropdown);
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

      this.getFirstEightProducts()
    
  }

  getFirstEightProducts(): void {
    this.firstEightProducts = this.products.slice(0, 8);
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
            this.dbCartProductIds.push(product.id!); 
            console.log(this.dbCartProductIds);
            // Add to local list immediately
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
//  showMoreNewArrivals(): void {
//     this.router.navigate(['/category'], { 
//       queryParams: { filter: 'new-arrivals' } 
//     });
//   }
  
  // showMoreTrending(): void {
  //   this.router.navigate(['/category'], { 
  //     queryParams: { filter: 'trending' } 
  //   });
  // }

  exploreMoreProducts(){
    this.router.navigate(['/get-all-products']);
  }

}