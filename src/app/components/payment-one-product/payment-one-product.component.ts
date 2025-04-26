import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartProduct } from 'src/app/Services/cart.service';
import { CheckoutService } from 'src/app/Services/checkout.service';

@Component({
  selector: 'app-payment-one-product',
  templateUrl: './payment-one-product.component.html',
  styleUrls: ['./payment-one-product.component.css']
})
export class PaymentOneProductComponent {

  id:number=0;

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
constructor(private checkoutService : CheckoutService, 
  private route : ActivatedRoute
){}

ngOnInit(){
  this.id = Number(this.route.snapshot.paramMap.get('id') || '');
  console.log(this.id);
  
  this.loadOrderSummary();
}

loadOrderSummary(){
  this.checkoutService.getOneProductOrderSummary(this.id).subscribe({
    next:(data)=>{
     console.log(data);
     
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

  
     
