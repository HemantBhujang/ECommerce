// order-confirmed.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css']
})
export class OrderConfirmedComponent {
  orderSummary = {
    items: ['Product A', 'Product B'],
    subtotal: 100,
    shippingCharges: 10,
    taxes: 5,
    total: 115
  };

  deliveryAddress = '123 Main St, Anytown USA';
  paymentMethod = 'Cash on Delivery';
  estimatedDeliveryDate = 'April 25, 2023';
}
