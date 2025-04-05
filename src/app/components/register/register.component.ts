import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  close=false;
  constructor( private registerService : LoginService){}
  addSeller=new FormGroup({
    name:new FormControl('',Validators.required),
    email:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)

  })

  signUp(){
    console.log(this.addSeller.value);
    this.registerService.userSignUp(this.addSeller.value).subscribe((res)=>{
      console.log(res);
      this.close=true;
      this.addSeller.reset()
   
  })
}
}
