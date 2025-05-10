import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/components/interface/product.model';
import { AdminServiceService } from 'src/app/Services/admin-service.service';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  addProductForm!: FormGroup;
  
  // Predefined color options - customize as needed
  availableColors: string[] = [
    'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 
    'Purple', 'Pink', 'Brown', 'Gray', 'Orange', 'Gold', 'Silver'
  ];
  
  // Predefined size options - customize as needed
  availableSizes: string[] = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL',
    '34', '36', '38', '40', '42', '44', '46'
  ];

  // For custom color and size inputs
  customColor: string = '';
  customSize: string = '';

  // Temporary arrays to display selected colors and sizes
  selectedColors: string[] = [];
  selectedSizes: string[] = [];
  
  // Show popup message
  showPopup: boolean = false;
  popupMessage: string = '';
  popupClass: string = '';

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService,
    private authService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      image2: [''],
      image3: [''],
      image4: [''],
      image5: [''],
      size: [''],         // This will store size array as string (will be converted in submit)
      color: [''],        // This will store color array as string (will be converted in submit)
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  // Color handling methods
  addSelectedColor(color: string): void {
    if (color && !this.selectedColors.includes(color)) {
      this.selectedColors.push(color);
      this.updateColorFormControl();
    }
  }

  addCustomColor(): void {
    if (this.customColor && !this.selectedColors.includes(this.customColor)) {
      this.selectedColors.push(this.customColor);
      this.updateColorFormControl();
      this.customColor = '';
    }
  }

  removeColor(color: string): void {
    this.selectedColors = this.selectedColors.filter(c => c !== color);
    this.updateColorFormControl();
  }

  updateColorFormControl(): void {
    this.addProductForm.patchValue({
      color: this.selectedColors.join(',')
    });
  }

  // Size handling methods
  addSelectedSize(size: string): void {
    if (size && !this.selectedSizes.includes(size)) {
      this.selectedSizes.push(size);
      this.updateSizeFormControl();
    }
  }

  addCustomSize(): void {
    if (this.customSize && !this.selectedSizes.includes(this.customSize)) {
      this.selectedSizes.push(this.customSize);
      this.updateSizeFormControl();
      this.customSize = '';
    }
  }

  removeSize(size: string): void {
    this.selectedSizes = this.selectedSizes.filter(s => s !== size);
    this.updateSizeFormControl();
  }

  updateSizeFormControl(): void {
    this.addProductForm.patchValue({
      size: this.selectedSizes.join(',')
    });
  }

  onSubmit(): void {
    if (this.addProductForm.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    const formValue = this.addProductForm.value;
    
    // Ensure at least one color and size is selected
    if (!this.selectedColors.length) {
      this.showMessage('Please select at least one color.', 'error');
      return;
    }
    
    if (!this.selectedSizes.length) {
      this.showMessage('Please select at least one size.', 'error');
      return;
    }

    const newProduct: any = {
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
      image2: formValue.image2 || null,
      image3: formValue.image3 || null,
      image4: formValue.image4 || null,
      image5: formValue.image5 || null,
      size: this.selectedSizes,
      color: this.selectedColors,
      quantity: formValue.quantity,
      created_at: new Date().toISOString()
    };

    this.productService.createProduct(newProduct).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.showMessage('Product added successfully!', 'success');
        this.addProductForm.reset();
        this.selectedColors = [];
        this.selectedSizes = [];
        setTimeout(() => {
           this.router.navigate(['/admin/product']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
        this.showMessage('Something went wrong. Please try again.', 'error');
      }
    });
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupClass = type;
    this.showPopup = true;
    
    setTimeout(() => {
      this.showPopup = false;
    }, 3000);
  }
}