// navbar.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  user: any = null;
  searchResult:any=[];

  constructor(public loginService: LoginService, private router: Router,private productService: ProductService) {}
  ngOnInit(): void {
    if (this.loginService.isLoggedIn()) {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        console.log("Navbar User:", this.user); // ✅ Debug info
      }
    }
  }
  

  onProfileClick() {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  goToProfile() {
    this.router.navigate(['/userProfile']);
  }

  editProfile() {
    if (this.user && this.user.id) {
      this.router.navigate([`/edit-profile/${this.user.id}`]);
      console.log("userId",this.user.id);
      
    } else {
      console.warn("User not logged in or ID not available");
      this.router.navigate(['/login']);
    }
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }

  searchProduct(query:Event){
    if(query){
      const element=(query.target as HTMLInputElement).value;
      console.log(element);

      if (!element) {
        this.searchResult = []; // Clear search results if input is empty
        return;
      }

      this.productService.searchProduct(element).subscribe((result:any)=>{
        // console.log(result);
         this.searchResult=result;
         //console.log(this.searchResult);
         })
        }
       }

  goToProduct(productId: number) {
    this.searchResult = []; // Clear results after navigation
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; // ✅ Clear input field
    }
    this.router.navigate(['/product-details', productId]);
   // this.searchResult.reset();

  }
  
}
