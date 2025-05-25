import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  editProductForm!: FormGroup;
  productId: number = 0;
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['id'];
    
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
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      size: this.fb.array([]),
      color: this.fb.array([]),
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    this.loadProductData();
  }

  loadProductData() {
    this.productService.getProductById(this.productId).subscribe(
      (result: any) => {
        console.log('Product data:', result);
        
        // Reset form arrays
        this.sizesArray.clear();
        this.colorsArray.clear();
        
        // Populate form with product data
        this.editProductForm.patchValue({
          name: result.name,
          description: result.description,
          old_price: result.old_price,
          discount_price: result.discount_price,
          discount: result.discount,
          category: result.category,
          parent_category: result.parent_category,
          sub_category: result.sub_category,
          stock: result.stock,
          image: result.image,
          image2: result.image2 || '',
          image3: result.image3 || '',
          image4: result.image4 || '',
          image5: result.image5 || '',
          quantity: result.quantity
        });
        
        // Handle size array
        if (result.size) {
          const sizes = Array.isArray(result.size) ? result.size : [result.size];
          sizes.forEach((size: string) => {
            if (size && size.trim() !== '') this.addSize(size);
          });
          
          // Add at least one empty size if none exist
          if (sizes.length === 0 || (sizes.length === 1 && (!sizes[0] || sizes[0].trim() === ''))) {
            this.addSize();
          }
        } else {
          this.addSize(); // Add one empty size field
        }
        
        // Handle color array
        if (result.color) {
          const colors = Array.isArray(result.color) ? result.color : [result.color];
          colors.forEach((color: string) => {
            if (color && color.trim() !== '') this.addColor(color);
          });
          
          // Add at least one empty color if none exist
          if (colors.length === 0 || (colors.length === 1 && (!colors[0] || colors[0].trim() === ''))) {
            this.addColor();
          }
        } else {
          this.addColor(); // Add one empty color field
        }
      },
      error => {
        console.error('Error loading product:', error);
        alert('Failed to load product details');
      }
    );
  }

  // Form array getters
  get sizesArray() {
    return this.editProductForm.get('size') as FormArray;
  }

  get colorsArray() {
    return this.editProductForm.get('color') as FormArray;
  }

  // Add a size to the form array
  addSize(value: string = '') {
    this.sizesArray.push(this.fb.control(value, Validators.required));
  }

  // Add a color to the form array
  addColor(value: string = '') {
    this.colorsArray.push(this.fb.control(value, Validators.required));
  }

  // Remove a size from the form array
  removeSize(index: number) {
    this.sizesArray.removeAt(index);
  }

  // Remove a color from the form array
  removeColor(index: number) {
    this.colorsArray.removeAt(index);
  }

  editProduct() {
    if (this.editProductForm.valid) {
      const formData = this.editProductForm.value;
      
      // Convert form arrays to simple arrays for backend
      // Filter out empty values
      formData.size = this.sizesArray.controls
        .map(control => control.value)
        .filter(size => size && size.trim() !== '');
      
      formData.color = this.colorsArray.controls
        .map(control => control.value)
        .filter(color => color && color.trim() !== '');
      
      // Make sure we have at least one size and color (empty array is valid too)
      if (formData.size.length === 0) {
        console.warn('No sizes provided, sending empty array');
      }
      
      if (formData.color.length === 0) {
        console.warn('No colors provided, sending empty array');
      }
      
      this.productService.updateProduct(this.productId, formData).subscribe(
        (result) => {
          console.log('Updated product:', result);
          alert('Product updated successfully!');
          this.router.navigate(['/admin/product']);
        },
        error => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
        }
      );
    } else {
      const invalidControls: string[] = [];
      
      // Find which controls are invalid for better error messaging
      Object.keys(this.editProductForm.controls).forEach(controlName => {
        const control = this.editProductForm.get(controlName);
        if (control && control.invalid) {
          invalidControls.push(controlName);
        }
      });
      
      alert(`Please complete all required fields: ${invalidControls.join(', ')}`);
    }
  }
}