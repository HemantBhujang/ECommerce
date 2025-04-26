import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartProduct } from 'src/app/Services/cart.service';
import { CheckoutService } from 'src/app/Services/checkout.service';

@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent {
  cartItems: CartProduct[] = [];

  image = '';
  address = '';
  arrivalDate = '';
  productNames = '';
  orderTotal = '';
  user: any = null;
  products: any[] = [];
  getItemTotal = 0;
  getDeliveryTotal = 0;
  id: number | null = null;

  constructor(
    private checkoutService: CheckoutService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;
    console.log('ID from URL:', this.id);

    this.loadOrderSummary();
  }

  loadOrderSummary() {
    if (this.id) {
      // If ID is present → load one product order summary
      this.checkoutService.getOneProductOrderSummary(this.id).subscribe({
        next: (data) => {
          console.log('Single Product Order Summary:', data);
          this.setOrderData(data);
        },
        error: (err) => {
          console.error('Error fetching single product summary', err);
        }
      });
    } else {
      // If no ID → load normal cart order summary
      this.checkoutService.getOrderSummary().subscribe({
        next: (data) => {
          console.log('Cart Order Summary:', data);
          this.setOrderData(data);
        },
        error: (err) => {
          console.error('Error fetching cart order summary', err);
        }
      });
    }
  }

  setOrderData(data: any) {
    this.user = data;
    this.arrivalDate = this.user.arrivalDate;
    this.address = this.user.address;
    this.orderTotal = this.user.orderTotal;
    this.products = this.user.products || [];
    console.log('Products:', this.products);

    this.getItemTotal = this.products.length;
    this.getDeliveryTotal = this.products.reduce((sum, product) => {
      return sum + (product.delivery || 0);
    }, 0);

    console.log('Total Item Count:', this.getItemTotal);
    console.log('Total Delivery Charge:', this.getDeliveryTotal);
  }
}
