import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private registerService : LoginService,private router:Router){}
  loginForm=new FormGroup({
    email:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)

  })

  // login.component.ts (updated)
  loginUser() {
    this.registerService.login(this.loginForm.value).subscribe(
      (res: any) => {
        if (res.token) {
         // alert("Login successful");
          localStorage.setItem('authToken', res.token);
  
          // ✅ Store user info
          let authUser =localStorage.setItem('authUser', JSON.stringify(res.user));
          console.log(authUser);

  
          this.router.navigate(['/']);
        } else {
          alert("Invalid email or password");
        }
      },
      (error) => {
        alert("Error connecting to the server");
        console.error(error);
      }
    );
  }
  

  
}

