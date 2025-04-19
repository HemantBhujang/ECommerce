import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  products: any[] = [];
  category = '';
  parent = '';
  sub = '';

  constructor(private route: ActivatedRoute, 
    private productService: ProductService,
     private router: Router,
    private cartService : CartService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.parent = params['parent'];
      this.sub = params['sub'];

      // Optionally, you can call a method here to load/filter products
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe((data) => {
      // Filter products by sub-category match
      this.products = data.filter((product: any) => 
        product.category.toLowerCase() === this.category &&
        product.parent_category.toLowerCase().replace(/\s+/g, '') === this.parent &&
        product.sub_category.toLowerCase().replace(/\s+/g, '') === this.sub
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
