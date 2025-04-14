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

  recentOrders = [
    { id: '1084', customer: 'John Doe', product: 'Premium Widget', amount: 129.99, status: 'Completed', date: '12 Apr 2025' },
    { id: '1083', customer: 'Sarah Johnson', product: 'Deluxe Package', amount: 299.50, status: 'Processing', date: '11 Apr 2025' },
    { id: '1082', customer: 'Michael Brown', product: 'Standard Widget', amount: 79.99, status: 'Pending', date: '10 Apr 2025' },
    { id: '1081', customer: 'Emily Davis', product: 'Premium Service', amount: 149.99, status: 'Completed', date: '09 Apr 2025' },
    { id: '1080', customer: 'David Wilson', product: 'Starter Kit', amount: 49.99, status: 'Cancelled', date: '09 Apr 2025' }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a real app, you would load data from a service here
  }
}