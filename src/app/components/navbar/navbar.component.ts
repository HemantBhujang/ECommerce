// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any = null;

  constructor(public loginService: LoginService, private router: Router) {}
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
}
