// components/dashboard-content/dashboard-content.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {

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
    private userService : UsersService
 ) { }

  ngOnInit(): void {

    this.getProdutCount()
    this.getUserCount()
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
}