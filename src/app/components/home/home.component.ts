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
      name: 'Men',
      img: 'https://tse1.mm.bing.net/th?id=OIP.dmQRXWusIlb_auYpgBDx8wHaKd&pid=Api&P=0&h=180',
      path: 'men',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Casual Wear',
          path: 'men/casual',
          children: [
            { name: 'T-Shirts', path: 'men/casual/tshirts' },
            { name: 'Jeans', path: 'men/casual/jeans' }
          ]
        },
        {
          name: 'Traditional Wear',
          path: 'men/traditional',
          children: [
            { name: 'Kurta', path: 'men/traditional/kurta' },
            { name: 'Sherwani', path: 'men/traditional/sherwani' }
          ]
        }
      ]
    },
    {
      name: 'Women',
      img: 'https://tse2.mm.bing.net/th?id=OIP.aLcChT8Y2gUkeiDMQQpCHAHaJl&pid=Api&P=0&h=180',
      path: 'women',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Casual Wear',
          path: 'women/casual',
          children: [
            { name: 'Tops', path: 'women/casual/tops' },
            { name: 'Jeans', path: 'women/casual/jeans' }
          ]
        },
        {
          name: 'Traditional Wear',
          path: 'women/traditional',
          children: [
            { name: 'Saree', path: 'women/traditional/saree' },
            { name: 'Lehenga', path: 'women/traditional/lehenga' }
          ]
        }
      ]
    },
    {
      name: 'Kids',
      img: 'https://tse1.mm.bing.net/th?id=OIP.la9Z6d3qwEIH77kmkaZQxwHaFs&pid=Api&rs=1&c=1&qlt=95&w=149&h=114',
      path: 'kids',
      hasSubcategories: true,
      subcategories: [
        {
          name: 'Casual Wear',
          path: 'kids/casual',
          children: [
            { name: 'Shirts', path: 'kids/casual/shirts' },
            { name: 'Shorts', path: 'kids/casual/shorts' }
          ]
        },
        {
          name: 'Traditional Wear',
          path: 'kids/traditional',
          children: [
            { name: 'Ethnic Sets', path: 'kids/traditional/ethnic' },
            { name: 'Frocks', path: 'kids/traditional/frocks' }
          ]
        }
      ]
    }
  ];
  
  

  navigateCategory(path: string) {
    this.router.navigate([path]);
  }

  products: any[] = [];

 
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;

      this.products.forEach(product => {
        console.log(`Product ID: ${product.id}`);
        console.log(`category : ${product.category}`);
        
        console.log(`Parent Category: ${product.parent_category}`);
        console.log(`Sub Category: ${product.sub_category}`);
      });
    });
    
  }

  productDetailsPage(id: number) {
    this.router.navigate(['/product-details', id]);
  }
  
}
