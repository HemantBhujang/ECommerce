import { Component } from '@angular/core';
import { AdminOrderService } from 'src/app/Services/admin-order-service.service';
import { ProductService } from 'src/app/Services/product.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
totalProducts:number=0;
  metrics = {
    clients: 128,
    clientsChange: 12.5,
    orders: 865,
    ordersChange: 8.3,
    products: 342,
    productsChange: -2.4,
    revenue: 125648,
    revenueChange: 15.7
  };

 

  constructor(private productService : ProductService,
    private userService : UsersService,
    private adminOrderService: AdminOrderService
 ) { }

  ngOnInit(): void {

    this.getProdutCount()
    this.getUserCount()
    this.getOrderCount()
  }

  getProdutCount(){
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        const totalProducts = products.length;
        console.log('Total Products:', totalProducts);
        this.totalProducts=totalProducts
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  getUserCount(){
  this.userService.getUsers().subscribe({
    next:(user:any)=>{
      const totalusers=user.length;
    console.log('Total Users:',totalusers);
    this.metrics.clients=totalusers
        }
  })
  }
  getOrderCount() {
    this.adminOrderService.getAllOrders().subscribe({
      next: (response: any) => {
        const totalOrders = response.orders.length;
        console.log('Total Orders:', totalOrders);
        this.metrics.orders = totalOrders;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });
  }
  
}
