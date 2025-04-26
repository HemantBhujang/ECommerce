// order-confirmed.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartProduct, CartService } from 'src/app/Services/cart.service';
import { CheckoutService } from 'src/app/Services/checkout.service';
import { DatabaseCartService } from 'src/app/Services/database-cart.service';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css']
})
export class OrderConfirmedComponent {
   cartItems: CartProduct[] = [];

   image=''
   address='';
   arrivalDate='';
   productNames='';
   orderTotal=''
   user: any = null;
   products: any[] = [];
   getItemTotal=0;
   getDeliveryTotal=0;


    constructor(
      private chechoutService: CheckoutService
     ) {}

     ngOnInit(){
     this.loadOrderSummary()
     }

     loadOrderSummary(){
      this.chechoutService.getOrderSummary().subscribe({
        next: (data) => {
          this.user = data;
          console.log(this.user);
          
          this.arrivalDate=this.user.arrivalDate
          this.address=this.user.address
        //  this.name=this.user.products.name
          this.orderTotal = this.user.orderTotal
        console.log('order total :',this.orderTotal)
      
          // const productNames = this.user.products.map((product: any) => product.name);
          // console.log(productNames);
          //  this.productNames = productNames;

          this.products = this.user.products;
          console.log('Products:', this.products);
          this.getItemTotal=Number(this.products.length);

          this.getDeliveryTotal = this.products.reduce((sum, product) => {
            return sum + (product.delivery || 0); // if delivery is undefined, treat as 0
          }, 0);
    
          console.log('Total Delivery Charge:', this.getDeliveryTotal);
       
        }
      })
     }

}
