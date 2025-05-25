import { Component } from '@angular/core';
import { AdminOrderService } from 'src/app/Services/admin-order-service.service';


interface Order {
  id?: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: string;
  quantity: number;
  status: string;
  total_cost: string;
  address: string;
  payment_method: string;
  customer_name?: string;
  customer_email?: string;
  order_date?: string;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
 orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  filterStatus: string = 'all';
  searchTerm: string = '';

  constructor(private adminOrderService: AdminOrderService) {}

  ngOnInit() {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.isLoading = true;
    this.adminOrderService.getAllOrders().subscribe({
      next: (response) => {
        if (response && response.orders) {
          this.orders = response.orders;
         // this.filteredOrders = [...this.orders];
          console.log('Fetched orders:', this.orders);
          
        } else {
          this.orders = [];
          this.filteredOrders = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.error = 'Failed to load orders. Please check your authentication or try again later.';
        this.isLoading = false;
      }
    });
  }

  filterOrders(status: string) {
    this.filterStatus = status;
    
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
    
    if (this.searchTerm) {
      this.applySearch(this.searchTerm);
    }
  }

  applySearch(term: string) {
    this.searchTerm = term.toLowerCase();
    
    // First filter by status
    let statusFiltered = this.filterStatus === 'all' 
      ? [...this.orders] 
      : this.orders.filter(order => order.status === this.filterStatus);
    
    // Then apply search term
    if (this.searchTerm) {
      this.filteredOrders = statusFiltered.filter(order => 
        order.product_name.toLowerCase().includes(this.searchTerm) ||
        order.address?.toLowerCase().includes(this.searchTerm) ||
        order.customer_name?.toLowerCase().includes(this.searchTerm) ||
        order.customer_email?.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredOrders = statusFiltered;
    }
  }

  updateStatus(orderId: number | undefined, newStatus: string) {
    if (!orderId) return;
    
    this.adminOrderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (response) => {
        // Update local order status
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = newStatus;
          this.filterOrders(this.filterStatus); // Re-apply current filter
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }
}
