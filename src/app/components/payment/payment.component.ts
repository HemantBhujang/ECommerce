// payment.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentMethod: string = '';

  constructor(private router: Router) {}

  onContinue() {
    if (this.paymentMethod === 'online') {
      this.router.navigate(['/online-payment']);
    } else {
      this.router.navigate(['/order-confirmed']);
    }
  }
}
