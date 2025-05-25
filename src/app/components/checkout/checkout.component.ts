import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from 'src/app/Services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(
    private router: Router,
    private checkOutService: CheckoutService,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { productIds: number[] };
    this.productIds = state?.productIds || [];
    
    console.log('Product IDs passed from cart:', this.productIds);
  }

  paymentMethod: string = "cash-on-delivery";
  address = '';
  name = '';
  phone_number = '';
  error: string = '';
  user: any = null;
  id = '';
  productIds: number[] = [];
  showInfoUpdatePopup = false;
  isProfileComplete = false;
  isLoading = true;

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }
  
  loadData(){
    this.isLoading = true;
    this.checkOutService.getcheckOut().subscribe({
      next: (data) => {
        this.user = data;
        
        this.name = this.user.address?.name || '';
        this.address = this.user.address?.address || '';
        this.phone_number = this.user.address?.phone_number || '';
        
        // Check if the user's profile is complete
        this.isProfileComplete = this.isProfileInfoComplete();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.error = 'Failed to load profile. Please log in again.';
        this.isLoading = false;
      },
    });
  }

  isProfileInfoComplete(): boolean {
    return !!(this.name && this.address && this.phone_number && 
           this.name.trim() !== '' && 
           this.address.trim() !== '' && 
           this.phone_number.trim() !== '');
  }

  gotoProfile(){
    this.router.navigate(['/userProfile']);
  }

  onContinue() {
    if (!this.isProfileInfoComplete()) {
      this.showInfoUpdatePopup = true;
      return;
    }
    
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
  
  closePopup() {
    this.showInfoUpdatePopup = false;
  }
  
  navigateToProfile() {
    this.showInfoUpdatePopup = false;
    this.router.navigate(['/userProfile']);
  }
}