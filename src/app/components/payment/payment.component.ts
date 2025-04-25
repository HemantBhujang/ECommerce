// payment.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentMethod: string = '';
  user: any = null;

  address='';
  name ='';
  phone_number='';
  error: string = '';

  constructor(private router: Router,private profileService: ProfileService) {}

  ngOnInit(){
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.name = this.user.name;
        this.address = this.user.address;
        this.phone_number = this.user.phone_number;
       // console.log(this.address);
        //console.log(this.name);
        
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.error = 'Failed to load profile. Please log in again.';
      },
    });
  }

  gotoProfile(){
    this.router.navigate(['/userProfile'])
  }
  onContinue() {
    if (this.paymentMethod === 'online') {
      this.router.navigate(['/online-payment']);
    } else {
      this.router.navigate(['/order-confirmed']);
    }
  }
}
