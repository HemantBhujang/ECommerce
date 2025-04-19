import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-main-category-products',
  templateUrl: './main-category-products.component.html',
  styleUrls: ['./main-category-products.component.css']
})
export class MainCategoryProductsComponent implements OnInit {
  category = '';
  products: any[] = [];
  validCategories = ['men', 'women', 'kids']; // Define valid categories

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService : CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      
      // Check if the category is valid
      if (!this.validCategories.includes(this.category.toLowerCase())) {
        this.router.navigate(['/not-found']);
        return;
      }
      
      this.loadCategoryProducts();
    });
  }

  loadCategoryProducts() {
    this.productService.getAllProducts().subscribe((data: any[]) => {
      this.products = data.filter(product =>
        product.category.toLowerCase() === this.category.toLowerCase()
      );
    });
  }

  goToDetails(id: number) {
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