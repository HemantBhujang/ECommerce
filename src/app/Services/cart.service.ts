// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../components/interface/product.model';

export interface CartProduct extends Product {
  id?: number;
  cart_item_id?: number; // Added this field
  name: string;
  description: string;
  old_price: string;
  discount_price: string;
  discount: number;
  category: string;
  parent_category: string;
  sub_category: string;
  stock: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  created_at: string;
  rating?: number;
  reviews?: number;
  brand?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shopping_cart';
  private cartItemsSubject = new BehaviorSubject<CartProduct[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage() {
    const cartData = localStorage.getItem(this.cartKey);
    if (cartData) {
      this.cartItemsSubject.next(JSON.parse(cartData));
    }
  }

  private saveCartToLocalStorage(items: CartProduct[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  getCartItems(): CartProduct[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: CartProduct) {
    const currentItems = this.getCartItems();
    const existingProductIndex = currentItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
      // Update quantity if product already exists in cart
      const updatedCart = [...currentItems];
      updatedCart[existingProductIndex].quantity = (updatedCart[existingProductIndex].quantity || 1) + (product.quantity || 1);
      this.saveCartToLocalStorage(updatedCart);
    } else {
      // Add new product to cart with quantity (default to 1 if not specified)
      const productToAdd = { ...product, quantity: product.quantity || 1 };
      const updatedCart = [...currentItems, productToAdd];
      this.saveCartToLocalStorage(updatedCart);
    }
  }

  removeFromCart(productId: number) {
    const currentItems = this.getCartItems();
    const updatedCart = currentItems.filter(item => item.id !== productId);
    this.saveCartToLocalStorage(updatedCart);
  }

  isProductInCart(productId: number): boolean {
    return this.getCartItems().some(item => item.id === productId);
  }

  getProductFromCart(productId: number): CartProduct | undefined {
    return this.getCartItems().find(item => item.id === productId);
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.getCartItems();
    const updatedCart = currentItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveCartToLocalStorage(updatedCart);
  }

  clearCart() {
    this.saveCartToLocalStorage([]);
  }

  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => {
      const itemPrice = Number(item.discount_price);
      const quantity = item.quantity || 1;
      return total + (itemPrice * quantity);
    }, 0);
  }
}