import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  dbCartProductIds: number[] = [];
  isLoading = true;
  selectedCategory: string = 'All';
  
  // Price filter
  minPrice: number = 0;
  maxPrice: number = 5000;
  
  // Color filter
  selectedColors: string[] = [];
  availableColors: string[] = [
    'blue', 'navy', 'darkblue', 'lightblue', 'skyblue',
    'lightcyan', 'pink', 'lightpink', 'hotpink', 'coral',
    'beige', 'magenta', 'purple', 'red', 'darkred',
    'orange', 'gold', 'yellow', 'black', 'white',
    'gray', 'brown', 'lightgreen', 'green', 'ivory',
    'lavender', 'lightgray', 'violet', 'cream', 'darkgray',
    'olive', 'darkgray', 'black'
  ];

  constructor(
    private router: Router, 
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private loginService: LoginService,
    private dbCartService: DatabaseCartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCartItems();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filteredProducts = data; // Initially show all products
      this.organizeCategories();
      this.applyFilters(); // Apply initial filters
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

  // Apply all filters
  applyFilters(): void {
    // Start with all products
    let result = [...this.products];
    
    // Filter by category
    if (this.selectedCategory !== 'All') {
      result = result.filter(product => product.category === this.selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(product => {
      const price = parseFloat(product.discount_price);
      return price >= this.minPrice && price <= this.maxPrice;
    });
    
    // Filter by selected colors
    if (this.selectedColors.length > 0) {
      result = result.filter(product => 
        this.selectedColors.some(color => 
          product.color && product.color.toLowerCase().includes(color.toLowerCase())
        )
      );
    }
    
    this.filteredProducts = result;
  }

  // Category filter
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  // Price filter
  updatePriceRange(min: string, max: string): void {
    this.minPrice = parseFloat(min) || 0;
    this.maxPrice = parseFloat(max) || 5000;
    this.applyFilters();
  }
  
  // Color filter
  toggleColorSelection(color: string): void {
    const index = this.selectedColors.indexOf(color);
    if (index !== -1) {
      this.selectedColors.splice(index, 1); // Remove color if already selected
    } else {
      this.selectedColors.push(color); // Add color if not selected
    }
    this.applyFilters();
  }
  
  isColorSelected(color: string): boolean {
    return this.selectedColors.includes(color);
  }
  
  // Clear all filters
  clearFilters(): void {
    this.selectedCategory = 'All';
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.selectedColors = [];
    this.applyFilters();
  }

  productDetailsPage(id: number): void {
    this.router.navigate(['/product-details', id]);
  }

  navigateCategory(path: string): void {
    this.router.navigate([path]);
  }

  addToCart(product: Product): void {
    const quantity = 1;
  
    if (this.loginService.isLoggedIn()) {
      const token = this.loginService.getToken();
      if (token) {
        this.dbCartService.addToCart(product.id!, quantity, token).subscribe({
          next: (response) => {
            this.dbCartProductIds.push(product.id!);
          },
          error: (err) => console.error('Error adding to DB cart', err)
        });
      }
    } else {
      this.cartService.addToCart({ ...product, quantity });
      this.dbCartProductIds.push(product.id!);
    }
  }
  
  isInCart(productId: number): boolean {
    return this.dbCartProductIds.includes(productId);
  }
  
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.toggleWishlistItem(product);
  }
  
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isProductInWishlist(productId);
  }
}