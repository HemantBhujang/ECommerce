import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/Services/order.service';

interface Order {
  product_id: number;
  product_name: string;
  product_image: string;
  price: string;
  quantity: number;
  status: string;
  total_cost: string;
  address: string;
  payment_method: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  groupedOrders: Order[][] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    public orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getMyOrder();
  }

  getMyOrder() {
    this.isLoading = true;
    this.orderService.getUserOrder().subscribe({
      next: (response: any) => {
        if (response && response.orders) {
          this.orders = response.orders;
          this.groupOrders();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.error = 'Failed to load your orders. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Group orders by assuming every 2-3 items make one order
  groupOrders() {
    const result: Order[][] = [];
    let currentGroup: Order[] = [];
    
    // Group orders randomly into 2-3 items per order
    this.orders.forEach((order, index) => {
      currentGroup.push(order);
      
      // Create a new group every 2-3 items
      if (currentGroup.length === (index % 2 === 0 ? 2 : 3) || index === this.orders.length - 1) {
        result.push([...currentGroup]);
        currentGroup = [];
      }
    });
    
    this.groupedOrders = result;
  }

  calculateOrderTotal(orderGroup: Order[]): string {
    const total = orderGroup.reduce((sum, order) => {
      return sum + (parseFloat(order.price) * order.quantity);
    }, 0);
    
    return total.toFixed(2);
  }

  getRandomPastDate(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 60) + 5; // Random date between 5-65 days ago
    const date = new Date(now.setDate(now.getDate() - randomDaysAgo));
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  getRandomDeliveryDate(): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30) + 3; // Random date between 3-33 days ago
    const date = new Date(now.setDate(now.getDate() - randomDaysAgo));
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
  
  // Navigate to product detail page
  viewProductDetails(productId: number): void {
    this.router.navigate(['/product-details', productId]);
  }
}