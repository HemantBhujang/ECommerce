import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartProduct } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartProduct[] = [];
  cartTotal: number = 0;
  private cartSub!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartSub = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.cartTotal = this.cartService.getCartTotal();
  }

  increaseQuantity(item: CartProduct): void {
    if (item.id && (item.quantity || 0) < 10) {  // Maximum limit of 10
      const newQuantity = (item.quantity || 1) + 1;
      this.cartService.updateQuantity(item.id, newQuantity);
    }
  }

  decreaseQuantity(item: CartProduct): void {
    if (item.id && (item.quantity || 0) > 1) {
      const newQuantity = (item.quantity || 2) - 1;
      this.cartService.updateQuantity(item.id, newQuantity);
    }
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}