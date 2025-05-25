import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent {
  user: any = null;
  error: string = '';
  profileForm: FormGroup;
  
  name = '';
  email = '';
  phone_number = '';
  nationality = '';
  address = '';

  popupMessage: string = '';
  showPopup: boolean = false;
  formSubmitted = false;

  constructor(
    private profileService: ProfileService, 
    private router: Router,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      nationality: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;

        this.name = this.user.name;
        this.email = this.user.email;
        this.phone_number = this.user.phone_number;
        this.nationality = this.user.nationality;
        this.address = this.user.address;
        
        // Update form values
        this.profileForm.patchValue({
          name: this.name,
          email: this.email,
          phone_number: this.phone_number,
          nationality: this.nationality,
          address: this.address
        });
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.error = 'Failed to load profile. Please log in again.';
      },
    });
  }

  isEditingPersonal = false;

  toggleEdit(section: string) {
    switch (section) {
      case 'personal':
        this.isEditingPersonal = !this.isEditingPersonal;
        this.formSubmitted = false; // Reset form submitted flag when toggling edit mode
        
        if (!this.isEditingPersonal) {
          // Revert form values when canceling edit
          this.profileForm.patchValue({
            name: this.name,
            email: this.email,
            phone_number: this.phone_number,
            nationality: this.nationality,
            address: this.address
          });
        }
        break;
    }
  }

  // Validation helper methods
  get formControls() {
    return this.profileForm.controls;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formControls[controlName].hasError(errorName) && 
           (this.formControls[controlName].touched || this.formSubmitted);
  }

  saveProfile() {
    this.formSubmitted = true;
    
    if (this.profileForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    const formValue = this.profileForm.value;
    const updatedData = {
      name: formValue.name,
      email: formValue.email,
      phone_number: formValue.phone_number,
      nationality: formValue.nationality,
      address: formValue.address,
    };
  
    this.profileService.updateProfile(updatedData).subscribe({
      next: (res) => {
        // Update component properties
        this.name = formValue.name;
        this.email = formValue.email;
        this.phone_number = formValue.phone_number;
        this.nationality = formValue.nationality;
        this.address = formValue.address;
        
        this.isEditingPersonal = false;
        this.popupMessage = 'Profile Updated successfully!';
        this.showPopup = true;
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.popupMessage = 'Failed to update profile. Please try again.';
        this.showPopup = true;
      },
    });
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile() {
    this.router.navigate(['/userProfile']);
  }
  
  closePopup() {
    this.showPopup = false;
  }
}