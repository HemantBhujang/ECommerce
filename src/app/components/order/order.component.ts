import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../app/Services/order.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderDetails: any = {};
  userId: string = 'user123';  // Example user ID (can come from auth service or session)
  isLoading: boolean = false;

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Fetch order summary (GET request)
    this.getOrderSummary();
  }

  // Get order summary
  getOrderSummary(): void {
    this.isLoading = true;
    this.orderService.getOrderData(this.userId).subscribe(
      (data) => {
        this.orderDetails = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching order data', error);
        this.isLoading = false;
      }
    );
  }

  // Handle place order action (POST request)
  placeOrder(): void {
    if (this.orderDetails && this.orderDetails.totalCost) {
      this.isLoading = true;
      this.orderService.createOrder(this.orderDetails).subscribe(
        (response) => {
          console.log('Order placed successfully:', response);
          // Redirect to payment gateway or show success message
          this.isLoading = false;
        },
        (error) => {
          console.error('Error placing order:', error);
          this.isLoading = false;
        }
      );
    }
  }
}