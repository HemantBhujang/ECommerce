// payment.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/Services/checkout.service';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  constructor(private router : Router, private checkOutService : CheckoutService){}

  paymentMethod: string = "online";
  address='';
  name ='';
  phone_number='';
  error: string = '';
  user: any = null;

  ngOnInit(){
    this.loadData()
  }


  loadData(){
    this.checkOutService.getcheckOut().subscribe({ next: (data) => {
      this.user = data;

      //console.log(this.user);
      
      this.name = this.user.address.name;
      //console.log(this.name);
      
      this.address = this.user.address.address;
      this.phone_number = this.user.address.phone_number;
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
