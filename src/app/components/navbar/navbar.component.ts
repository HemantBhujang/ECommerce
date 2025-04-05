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
      this.user = this.loginService.getUser(); // ✅ Now will return correct object
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
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
