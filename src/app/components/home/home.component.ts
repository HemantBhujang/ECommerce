import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private productService : ProductService) {}

  categories = [
    {
      name: 'MENS',
      img: 'https://tse1.mm.bing.net/th?id=OIP.dmQRXWusIlb_auYpgBDx8wHaKd&pid=Api&P=0&h=180',
      path: 'menCategory'
    },
    {
      name: 'WOMENS',
      img: 'https://tse2.mm.bing.net/th?id=OIP.aLcChT8Y2gUkeiDMQQpCHAHaJl&pid=Api&P=0&h=180',
      path: 'womenCategory'
    },
    {
      name: 'KIDS',
      img: 'https://tse1.mm.bing.net/th?id=OIP.la9Z6d3qwEIH77kmkaZQxwHaFs&pid=Api&rs=1&c=1&qlt=95&w=149&h=114',
      path: 'kidsCategory'
    }
  ];

  navigateCategory(path: string) {
    this.router.navigate([path]);
  }

  products: any[] = [];

 
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
    
  }

  productDetailsPage(id: number) {
    this.router.navigate(['/product-details', id]);
  }
  
}
