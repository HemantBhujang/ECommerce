import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router){}
  title = 'ecommerce';
  isSignup():boolean {
    return this.router.url === '/'
  }
  signInpage():boolean{
    let url = this.router.url === '/login' ||
     this.router.url==='/register' || 
     this.router.url==='/adminLogin' || 
     this.router.url.includes('/adminDashboard')||
     this.router.url === '/online-order'
    //  this.router.url.includes('/product-details')
    //  this.router.url==='/adminDashboard'||
    //  this.router.url === '/adminDashboard/dashboard'||
    //  this.router.url==='/adminDashboard/products'||
    //  this.router.url === '/adminDashboard/addproducts'
    //  this.router.url =='adminDashnoard/viewproducts/'
         return url
  }
  
}
