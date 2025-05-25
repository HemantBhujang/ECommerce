import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { Product } from '../interface/product.model';
import { finalize, Subscription } from 'rxjs';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;
  quantity: number = 1;
  isInCart1: boolean = false;
  selectedImage: string | null = null;
  
  // New properties for multi-color and multi-size
  availableColors: string[] = [];
  availableSizes: string[] = [];
  selectedColor: string = '';
  selectedSize: string = '';
  
  private routeSub!: Subscription;
  private cartSub!: Subscription;
  isLoading = true;
  dbCartProductIds: number[] = [];
  id = '';

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private dbCartService: DatabaseCartService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.routeSub = this.route.params.subscribe(params => {
      const productId = +params['id']; // Convert to number
      this.loadProductDetails(productId);
      this.checkIfInCart(productId);
      this.loadCartItems();
    });

    // Subscribe to cart changes to update UI accordingly
    this.cartSub = this.cartService.cartItems$.subscribe(() => {
      if (this.product && this.product.id) {
        this.checkIfInCart(this.product.id);
      }
    });
  }

  loadProductDetails(id: number) {
    this.productService.getProductById(id).subscribe((res: Product) => {
      this.product = res;
      this.selectedImage = res.image;
      this.checkIfInCart(id);
      
      // Parse colors and sizes
      this.parseColorAndSizeOptions();
    });
  }

  parseColorAndSizeOptions() {
    // Parse colors - assuming product.color could be a comma-separated string
    if (this.product.color) {
      this.availableColors = this.product.color.map(color => color.trim());
      this.selectedColor = this.availableColors[0];
    }
    
    // Parse sizes - assuming product.size could be a comma-separated string
    if (this.product.size) {
      this.availableSizes = this.product.size.map(size => size.trim().toUpperCase());
      this.selectedSize = this.availableSizes[0];
    }
  }

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }
  
  selectColor(color: string) {
    this.selectedColor = color;
  }
  
  selectSize(size: string) {
    this.selectedSize = size;
  }

  checkIfInCart(productId: number) {
    this.isInCart1 = this.cartService.isProductInCart(productId);
    
    // If in cart, update quantity to match what's in cart
    if (this.isInCart1) {
      const cartItem = this.cartService.getProductFromCart(productId);
      if (cartItem && cartItem.quantity) {
        this.quantity = cartItem.quantity;
      }
    }
  }

  increaseQuantity() {
    if (this.quantity < 10) { // Adding a reasonable max limit
      this.quantity++;
      if (this.isInCart1 && this.product.id) {
        this.cartService.updateQuantity(this.product.id, this.quantity);
      }
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      if (this.isInCart1 && this.product.id) {
        this.cartService.updateQuantity(this.product.id, this.quantity);
      }
    }
  }

  addToCart() {
    if (this.product) {
      // Create a copy of the product with quantity, selected color and size
      const productToAdd = { 
        ...this.product, 
        quantity: this.quantity,
        selectedColor: this.selectedColor,
        selectedSize: this.selectedSize 
      };
      this.cartService.addToCart(productToAdd);
      this.isInCart1 = true;
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  buyNow() {
    if (!this.isInCart1) {
      this.addToCart();
    }
    this.router.navigate(['/checkout', this.id]);
  }

  ngOnDestroy() {
    // Clean up subscriptions when component is destroyed
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }

  isInCart(productId: number): boolean {
    return this.dbCartProductIds.includes(productId);
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
}