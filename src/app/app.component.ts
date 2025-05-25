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
     this.router.url.includes('/admin')||
     this.router.url === '/online-order'
         return url
  }
  
}
