import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminServiceService } from 'src/app/Services/admin-service.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  message: string = '';
  isLoading: boolean = false;

  AdminLoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private adminAuth: AdminServiceService, private router: Router) {}

  loginAdmin() {
    if (this.AdminLoginForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    this.adminAuth.loginAdmin(this.AdminLoginForm.value as { email: string; password: string }).subscribe({
      next: (res: any) => {
        localStorage.setItem('adminToken', res.token);
        this.message = '✅ Login successful!';
        this.AdminLoginForm.reset();
        this.router.navigate(['/admin']); // Redirect after login
      },
      error: (err) => {
        this.message = '❌ ' + (err.error?.message || 'Login failed');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
