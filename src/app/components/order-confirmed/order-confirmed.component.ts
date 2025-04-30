import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProduct } from 'src/app/Services/cart.service';
import { CheckoutService } from 'src/app/Services/checkout.service';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.css']
})
export class OrderConfirmedComponent {
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
  productIds: number[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
  const state = nav?.extras?.state as { productIds: number[] };
  this.productIds = state?.productIds || [];
  console.log('Received product IDs in order confirmed:', this.productIds);
  }

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
          console.log('Single Product Order Summary (Order Confirmed):', data);
          this.setOrderData(data);
        },
        error: (err) => {
          console.error('Error fetching single product order summary', err);
        }
      });
    } else {
      // If no ID → load normal cart order summary
      this.checkoutService.getOrderSummary().subscribe({
        next: (data) => {
          console.log('Cart Order Summary (Order Confirmed):', data);
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


  confirmedOrder() {
    if (this.id) {
      // Case: ID is available
      this.orderService.cashOnDelivery(this.products, this.address).subscribe({
        next: (data) => {
          console.log('Order confirmed successfully with ID:', this.id, data);
        },
        error: (err) => {
          console.error('Error confirming order with ID', err);
        }
      });
    } else {
      // Case: No ID present – use product data from setOrderData
      const productIds = this.products.map(p => p.product_id);
      const orderPayload = {
        productIds: productIds,
        address: this.address,
        totalAmount: this.orderTotal,
        deliveryCharge: this.getDeliveryTotal,
        items: this.products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity,
          price: p.price,
          total: p.total,
          delivery: p.delivery
        }))
      };
  
      this.orderService.cashOnDelivery(this.products, this.address).subscribe({
        next: (data) => {
          console.log('Order confirmed without ID, new order created:', data);
        },
        error: (err) => {
          console.error('Error confirming order without ID', err);
        }
      });
    }
  }
  
}

