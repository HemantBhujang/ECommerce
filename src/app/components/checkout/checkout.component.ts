import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from 'src/app/Services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(private router : Router, 
    private checkOutService : CheckoutService,
     private route: ActivatedRoute,
  ){
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { productIds: number[] };
    this.productIds = state?.productIds || [];

    console.log('Product IDs passed from cart:', this.productIds);
  }

  paymentMethod: string = "online";
  address='';
  name ='';
  phone_number='';
  error: string = '';
  user: any = null;
  id='';
  productIds: number[] = [];

  ngOnInit(){

    this.id = this.route.snapshot.paramMap.get('id') || '';
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
      if (this.id) {
        this.router.navigate(['/online-payment', this.id]);
      } else {
        this.router.navigate(['/online-payment'], {
          state: { productIds: this.productIds }
        });
      }
    } else {
      if (this.id) {
        this.router.navigate(['/order-confirmed', this.id]);
      } else {
        this.router.navigate(['/order-confirmed'], {
          state: { productIds: this.productIds }
        });
      }
    }
  }
  
  
}
