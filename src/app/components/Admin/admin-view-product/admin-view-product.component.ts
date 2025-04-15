import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../../interface/product.model';

@Component({
  selector: 'app-admin-view-product',
  templateUrl: './admin-view-product.component.html',
  styleUrls: ['./admin-view-product.component.css']
})
export class AdminViewProductComponent {
constructor(private productService : ProductService, private route: ActivatedRoute){}

product: Product | null = null;

ngOnInit(): void {
  const productId = this.route.snapshot.params['id'];
  this.productService.getProductById(productId).subscribe((result: Product) => {
    this.product = result;
  });
}
}
