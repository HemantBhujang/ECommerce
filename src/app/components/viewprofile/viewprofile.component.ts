import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent {
  user: any = null;
  error: string = '';

  name ='';
  email = '';
  phone_number='';
  nationality='';
  address='';

  constructor(private profileService: ProfileService, private router: Router) {}

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
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.error = 'Failed to load profile. Please log in again.';
      },
    });
  }


  isEditingPersonal = false;
  isEditingEmail = false;
  isEditingMobile = false;
  isEditingAddress =false;
  isEditingNationality =false

  
  

  toggleEdit(section: string) {
    switch (section) {
      case 'personal':
        this.isEditingPersonal = !this.isEditingPersonal;
        break;
      case 'email':
        this.isEditingEmail = !this.isEditingEmail;
        break;
      case 'mobile':
        this.isEditingMobile = !this.isEditingMobile;
        break;
      case 'address':
        this.isEditingAddress = !this.isEditingAddress;
        break;
      case 'nationality':
        this.isEditingNationality = !this.isEditingNationality;
        break;
    }
  }

  saveProfile() {
    const updatedData = {
      name: this.name,
      email: this.email,
      phone_number: this.phone_number,
      nationality: this.nationality,
      address: this.address,
    };
  
    this.profileService.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.isEditingPersonal = false;
        this.isEditingEmail = false;
        this.isEditingMobile = false;
        this.isEditingAddress = false;
        this.isEditingNationality = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Failed to update profile. Please try again.');
      },
    });
  }
  

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProfile(){
    this.router.navigate(['/userProfile'])
  }
}
