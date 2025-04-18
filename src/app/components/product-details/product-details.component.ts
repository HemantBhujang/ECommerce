import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;
  private routeSub!: Subscription;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSub = this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProductDetails(productId);
    });
  }

  loadProductDetails(id: number) {
    this.productService.getProductById(id).subscribe((res: Product) => {
      this.product = res;
    });
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}