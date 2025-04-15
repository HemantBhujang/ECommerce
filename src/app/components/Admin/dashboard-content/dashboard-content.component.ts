// components/dashboard-content/dashboard-content.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent implements OnInit {
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

 

  constructor() { }

  ngOnInit(): void {
    // In a real app, you would load data from a service here
  }
}