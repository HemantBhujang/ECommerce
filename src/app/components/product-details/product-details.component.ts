import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { CartService } from 'src/app/Services/cart.service';
import { Product } from '../interface/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;
  quantity: number = 1;
  isInCart: boolean = false;
  private routeSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private productService: ProductService, 
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSub = this.route.params.subscribe(params => {
      const productId = +params['id']; // Convert to number
      this.loadProductDetails(productId);
      this.checkIfInCart(productId);
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
      this.checkIfInCart(id);
    });
  }

  checkIfInCart(productId: number) {
    this.isInCart = this.cartService.isProductInCart(productId);
    
    // If in cart, update quantity to match what's in cart
    if (this.isInCart) {
      const cartItem = this.cartService.getProductFromCart(productId);
      if (cartItem && cartItem.quantity) {
        this.quantity = cartItem.quantity;
      }
    }
  }

  increaseQuantity() {
    if (this.quantity < 10) { // Adding a reasonable max limit
      this.quantity++;
      if (this.isInCart && this.product.id) {
        this.cartService.updateQuantity(this.product.id, this.quantity);
      }
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      if (this.isInCart && this.product.id) {
        this.cartService.updateQuantity(this.product.id, this.quantity);
      }
    }
  }

  addToCart() {
    if (this.product) {
      // Create a copy of the product with quantity
      const productToAdd = { ...this.product, quantity: this.quantity };
      this.cartService.addToCart(productToAdd);
      this.isInCart = true;
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  buyNow() {
    if (!this.isInCart) {
      this.addToCart();
    }
    this.router.navigate(['/checkout']);
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
}