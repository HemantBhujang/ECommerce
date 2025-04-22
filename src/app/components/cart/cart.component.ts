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
cartTotal: number = 0;
private cartSub!: Subscription;
token: string | null = null;
isLoggedIn: boolean = false;


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
        
          // ADD THESE FIELDS TO MATCH CartProduct interface
          sub_category: item.sub_category || '',
          size: item.size || '',
          color: item.color || '',
          created_at: item.created_at || ''
        }));
        

        this.calculateTotal();
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
    });
  }
}


calculateTotal(): void {
  this.cartTotal = this.cartItems.reduce((total, item) => {
    const price = Number(item.discount_price);
    const qty = item.quantity || 1;
    return total + price * qty;
  }, 0);
}increaseQuantity(item: CartProduct): void {
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

removeFromCart(productId: number): void {
  if (this.isLoggedIn && this.token) {
    this.dbCartService.removeFromCart(productId, this.token).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.id !== productId);
      this.calculateTotal();
    });
  } else {
    this.cartService.removeFromCart(productId);
  }
}

clearCart(): void {
  if (this.isLoggedIn) {
    // Optional: implement a bulk delete endpoint in the backend
    this.cartItems.forEach(item => this.removeFromCart(item.id!));
  } else {
    this.cartService.clearCart();
  }
}


  continueShopping(): void {
    this.router.navigate(['/']);
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