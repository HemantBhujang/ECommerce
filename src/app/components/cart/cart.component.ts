import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartProduct } from 'src/app/Services/cart.service';
import { LoginService } from 'src/app/Services/login.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartProduct[] = [];
  paginatedItems: CartProduct[] = [];
  cartTotal: number = 0;
  private cartSub!: Subscription;
  token: string | null = null;
  isLoggedIn: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  constructor(
    private cartService: CartService,
    private dbCartService: DatabaseCartService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.loginService.isLoggedIn();
    this.token = this.loginService.getToken();

    if (this.isLoggedIn && this.token) {
      this.dbCartService.getCartItems(this.token).subscribe({
        next: (items: any[]) => {
          this.cartItems = items.map(item => ({
            id: item.product_id,
            cart_item_id: item.cart_item_id,
            name: item.product_name,
            image: item.product_image,
            discount_price: item.product_price,
            quantity: item.quantity,
            description: item.product_description || '',
            old_price: item.old_price || item.product_price,
            discount: item.discount || 0,
            category: item.category || '',
            parent_category: item.parent_category || '',
            brand: item.brand || '',
            stock: item.stock || 0,
            rating: item.rating || 0,
            reviews: item.reviews || 0,
            sub_category: item.sub_category || '',
            size: item.size || '',
            color: item.color || '',
            created_at: item.created_at || ''
          }));
          
          this.calculateTotal();
          this.updatePagination();
        },
        error: (err) => {
          console.error('Error fetching DB cart items:', err);
        }
      });
    } else {
      // Guest user — use local cart
      this.cartSub = this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.calculateTotal();
        this.updatePagination();
      });
    }
  }

  calculateTotal(): void {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      const price = Number(item.discount_price);
      const qty = item.quantity || 1;
      return total + price * qty;
    }, 0);
  }

  increaseQuantity(item: CartProduct): void {
    if ((item.quantity || 0) < 10) {
      const newQty = (item.quantity || 1) + 1;

      if (this.isLoggedIn && this.token) {
        this.dbCartService.addToCart(item.id!, 1, this.token).subscribe(() => {
          item.quantity = newQty;
          this.calculateTotal();
        });
      } else {
        this.cartService.updateQuantity(item.id!, newQty);
      }
    }
  }

  decreaseQuantity(item: CartProduct): void {
    if ((item.quantity || 0) > 1) {
      const newQty = (item.quantity || 2) - 1;

      if (this.isLoggedIn && this.token) {
        this.dbCartService.addToCart(item.id!, -1, this.token).subscribe(() => {
          item.quantity = newQty;
          this.calculateTotal();
        });
      } else {
        this.cartService.updateQuantity(item.id!, newQty);
      }
    }
  }

  removeFromCart(cartItemId: number | undefined, productId: number): void {
    if (this.isLoggedIn && this.token) {
      if (!cartItemId) return;
  
      this.dbCartService.removeFromCart(cartItemId, this.token).subscribe(() => {
        this.cartItems = this.cartItems.filter(item => item.cart_item_id !== cartItemId);
        this.calculateTotal();
        this.updatePagination();
      });
    } else {
      // For local storage cart, filter by product ID directly
      this.cartService.removeFromCart(productId);
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
      this.calculateTotal();
      this.updatePagination();
    }
  }
  
  clearCart(): void {
    if (this.isLoggedIn && this.token) {
      // Optional: implement a bulk delete endpoint in the backend
      // For now, we'll delete items one by one
      [...this.cartItems].forEach(item => {
        if (item.cart_item_id) {
          this.removeFromCart(item.cart_item_id, item.id!);
        }
      });
    } else {
      this.cartService.clearCart();
      this.updatePagination();
    }
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }

  checkout(): void {
    const productIds = this.cartItems.map(item => item.id);
    this.router.navigate(['/checkout'], {
      state: { productIds }
    });
  }
  
  // Helper method to calculate item total price
  getItemTotal(price: string, quantity: number): number {
    return Number(price) * (quantity || 1);
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.cartItems.length / this.itemsPerPage));
    
    // If current page is beyond the new total pages, reset to last page
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    
    this.getPaginatedItems();
  }

  getPaginatedItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.cartItems.length);
    this.paginatedItems = this.cartItems.slice(startIndex, endIndex);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.getPaginatedItems();
    
    // Scroll to top of the cart table for better UX
    window.scrollTo({ top: (document.querySelector('.container') as HTMLElement)?.offsetTop || 0, behavior: 'smooth' });
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}