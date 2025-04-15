import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-admin-edit-product',
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.css']
})
export class AdminEditProductComponent {
editProductForm!: FormGroup;
 constructor(private fb: FormBuilder, private productService: ProductService,private router: ActivatedRoute) {}

  ngOnInit(): void {

   // console.log("Token being used:", this.authService.getToken());

    this.editProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      old_price: ['', [Validators.required, Validators.min(0)]],
      discount_price: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      category: ['', Validators.required],
      parent_category: ['', Validators.required],
      sub_category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
      size: ['', Validators.required],
      color: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });


    this.productService.getProductById(this.router.snapshot.params['id']).subscribe((result :any)=>{
       console.log(result);
       this.editProductForm=new FormGroup({
        name: new FormControl(result['name']),
        description: new FormControl(result['description']),
        old_price: new FormControl(result['old_price']),
        discount_price: new FormControl(result['discount_price']),
        discount: new FormControl(result['discount']),

        category: new FormControl(result['category']),
        parent_category: new FormControl(result['parent_category']),
        sub_category: new FormControl(result['sub_category']),
        stock: new FormControl(result['stock']),
        image: new FormControl(result['image']),
        size: new FormControl(result['size']),
        color: new FormControl(result['color']),
       
       })
       
    })
  }
editProduct(){
this.productService.updateProduct(this.router.snapshot.params['id'],this.editProductForm.value).subscribe((result)=>{
  console.log(result);
  alert("product updated successfull!!")
  setTimeout(() => {
    this.editProductForm.reset({})
  }, 1000);
  
})
}
}
