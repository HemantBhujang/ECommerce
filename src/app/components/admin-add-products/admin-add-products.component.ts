import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../interface/product.model';
import { ProductService } from 'src/app/Services/product.service';
import { AdminServiceService } from 'src/app/Services/admin-service.service';

@Component({
  selector: 'app-admin-add-products',
  templateUrl: './admin-add-products.component.html',
  styleUrls: ['./admin-add-products.component.css']
})
export class AdminAddProductsComponent {
  addProductForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private authService : AdminServiceService) {}

  ngOnInit(): void {

    console.log("Token being used:", this.authService.getToken());

    this.addProductForm = this.fb.group({
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
  }

  onSubmit(): void {
    if (this.addProductForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }
    console.log('Token from AdminServiceService:', this.authService.getToken());

    
    const formValue = this.addProductForm.value;

    const newProduct: Product = {
      name: formValue.name,
      description: formValue.description,
      old_price: formValue.old_price,
      discount_price: formValue.discount_price,
      discount: formValue.discount,
      category: formValue.category,
      parent_category: formValue.parent_category,
      sub_category: formValue.sub_category,
      stock: formValue.stock,
      image: formValue.image,
      size: formValue.size,
      color: formValue.color,
      quantity: formValue.quantity,
      created_at: new Date().toISOString()
    };
    console.log("Token being used:", this.authService.getToken());

    this.productService.createProduct(newProduct).subscribe({
      next: () => {
        alert('✅ Product added successfully!');
        this.addProductForm.reset();
      },
      error: (error:any) => {
        console.error('Error creating product:', error);
        alert('❌ Something went wrong. Please try again.');
      }
    });
  }

  
}
