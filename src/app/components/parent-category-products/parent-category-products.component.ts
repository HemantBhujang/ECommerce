import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-parent-category-products',
  templateUrl: './parent-category-products.component.html',
  styleUrls: ['./parent-category-products.component.css']
})
export class ParentCategoryProductsComponent implements OnInit {
  category: string = '';
  parent: string = '';
  products: any[] = [];

  constructor(private route: ActivatedRoute,
     private productService: ProductService,
     private router : Router,
    private cartService : CartService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.parent = params['parent'];

      this.productService.getAllProducts().subscribe((data: any[]) => {
        this.products = data.filter(product =>
          product.category.toLowerCase() === this.category.toLowerCase() &&
          product.parent_category.toLowerCase().replace(/\s+/g, '') === this.parent.toLowerCase()
        );
      });
    });
  }
  productDetailsPage(id: number) {
    // Same as in HomeComponent
    this.router.navigate(['/product-details', id]);
  }
   addToCart(product: Product) {
      this.cartService.addToCart(product);
    }
  
    isInCart(productId: number): boolean {
      return this.cartService.isProductInCart(productId);
    }
  
    goToCart() {
      this.router.navigate(['/cart']);
    }
}
