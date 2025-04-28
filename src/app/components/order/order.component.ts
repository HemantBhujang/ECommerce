import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../app/Services/order.service'
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  constructor(private http: HttpClient) {}

  yourCartProducts = [
    {
      product_id: 123,
      name: "Laptop",
      image: "laptop.jpg",
      price: 50000,
      quantity: 1,
      total: 50000
    }
  ];
  
  yourUserAddress = "123 Main Street, Mumbai";

  continuePayment() {
    const createOrderData = {
      products: this.yourCartProducts,
      address: this.yourUserAddress
    };

    // Step 1: Create Order by calling backend
    this.http.post<any>('/api/onlinepay/create-order', createOrderData).subscribe((res) => {
      const orderId = res.order_id; // get order_id from backend

      const options: any = {
        key: 'YOUR_PUBLIC_KEY', // Razorpay public key
        amount: res.amount, // from backend (already in paise)
        currency: 'INR',
        name: 'Your Company',
        description: 'Order Payment',
        order_id: orderId,
        handler: (response: any) => {
          // Step 2: After Payment Success, verify and save to database
          const paymentData = {
            products: this.yourCartProducts,
            address: this.yourUserAddress,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id
          };

          this.http.post('/api/onlinepay/verify-payment', paymentData).subscribe((res) => {
            console.log('Order Saved Successfully!', res);
            // Redirect to success page or show message
          }, (err) => {
            console.error('Error saving order', err);
          });
        },
        theme: {
          color: '#3399cc'
        }
      };

      // const rzp = new Razorpay(options);
      // rzp.open();
    });
  }
}