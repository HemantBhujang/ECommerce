import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-main-category-products',
  templateUrl: './main-category-products.component.html',
  styleUrls: ['./main-category-products.component.css']
})
export class MainCategoryProductsComponent implements OnInit {
  category = '';
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];

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
}
