import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/components/interface/product.model';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
constructor(private productService : ProductService, private route: ActivatedRoute){}

product: Product | null = null;

ngOnInit(): void {
  const productId = this.route.snapshot.params['id'];
  this.productService.getProductById(productId).subscribe((result: Product) => {
    this.product = result;
  });
}
}
