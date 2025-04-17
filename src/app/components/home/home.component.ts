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

  categories: any[] = [];

  
  

  navigateCategory(path: string) {
    this.router.navigate([path]);
  }

  products: any[] = [];

 
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
  
      const grouped: any = {};
  
      this.products.forEach(product => {
        const { category, parent_category, sub_category, image } = product;
  
        if (!grouped[category]) {
          grouped[category] = {
            name: category,
            img: image,
            path: category.toLowerCase(),
            hasSubcategories: true,
            subcategories: []
          };
        }
  
        const parentExists = grouped[category].subcategories.find((p: any) => p.name === parent_category);
        if (!parentExists) {
          grouped[category].subcategories.push({
            name: parent_category,
            path: `${category.toLowerCase()}/${parent_category.toLowerCase().replace(/\s+/g, '')}`,
            children: []
          });
        }
  
        const parentIndex = grouped[category].subcategories.findIndex((p: any) => p.name === parent_category);
        const childExists = grouped[category].subcategories[parentIndex].children.find(
          (c: any) => c.name === sub_category
        );
  
        if (!childExists) {
          grouped[category].subcategories[parentIndex].children.push({
            name: sub_category,
            path: `${category.toLowerCase()}/${parent_category.toLowerCase().replace(/\s+/g, '')}/${sub_category.toLowerCase().replace(/\s+/g, '')}`
          });
        }
      });
  
      this.categories = Object.values(grouped);
    });
  }
  
  

  productDetailsPage(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  getCategoryImage(categoryName: string): any {
    switch (categoryName.toLowerCase()) {
      case 'men':
        return 'https://tse1.mm.bing.net/th?id=OIP.dmQRXWusIlb_auYpgBDx8wHaKd&pid=Api&P=0&h=180';
      case 'women':
        return 'https://tse2.mm.bing.net/th?id=OIP.aLcChT8Y2gUkeiDMQQpCHAHaJl&pid=Api&P=0&h=180';
      case 'kids':
        return 'https://tse1.mm.bing.net/th?id=OIP.la9Z6d3qwEIH77kmkaZQxwHaFs&pid=Api&rs=1&c=1&qlt=95&w=149&h=114';
      default:
        //return category.img || 'https://via.placeholder.com/150'; // fallback image
    }
  }
  
  
}
