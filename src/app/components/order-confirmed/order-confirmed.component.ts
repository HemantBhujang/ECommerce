// order-confirmed.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartProduct, CartService } from 'src/app/Services/cart.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css']
})
export class OrderConfirmedComponent {
   cartItems: CartProduct[] = [];

    constructor(
       private cartService: CartService,
       private dbCartService: DatabaseCartService,
       private loginService: LoginService,
       private router: Router
     ) {}
}
