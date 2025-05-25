import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Make sure this is added!
})
export class RegisterComponent {
  constructor(private registerService: LoginService,private router : Router) {}

  showPopup: boolean = false;
  popupMessage: string = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/)
    ])
  });

  registerUser() {
    if (this.registerForm.valid) {
      this.registerService.userSignUp(this.registerForm.value).subscribe({
        next: (res: any) => {
          this.popupMessage = res.message || 'Registration successful! Please login.';
          this.showPopup = true;
          this.registerForm.reset();

          setTimeout(() => {  
            this.router.navigate(['/login']);
          }
          , 1000);
        },
        error: (err) => {
          this.popupMessage = err.error?.message || 'Registration failed. Please try again.';
          this.showPopup = true;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  closePopup() {
    this.showPopup = false;
  }
}
