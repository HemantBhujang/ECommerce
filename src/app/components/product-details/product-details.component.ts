import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';
import { Product } from '../interface/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  product!: Product;

  constructor(private productService : ProductService, private route : ActivatedRoute){}

  ngOnInit(){
    this.productService.getProductById(this.route.snapshot.params['id']).subscribe((res:Product)=>{
      //console.log(res);
      this.product=res;
    })
  }
}
