import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

   AdminLoginForm=new FormGroup({
      username:new FormControl('',[Validators.required]),
      password:new FormControl('',[Validators.required])
  
    })
  loginAdmin(){
    console.log(this.AdminLoginForm.value);
    
    setTimeout(()=>this.AdminLoginForm.reset(),2000)
  }
}
