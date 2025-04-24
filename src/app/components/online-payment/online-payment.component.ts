// online-payment.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent {
  orderSummary = {
    items: ['Product A', 'Product B'],
    subtotal: 100,
    shippingCharges: 10,
    taxes: 5,
    total: 115
  };

  deliveryAddress = '123 Main St, Anytown USA';
  cardNumber = '';
  expirationDate = '';
  cvv = '';
  estimatedDeliveryDate = 'April 25, 2023';

  onPlaceOrder() {
    // Implement the logic to place the order
  }
}
