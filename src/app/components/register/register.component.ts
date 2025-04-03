import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  close=false;
  constructor(){}
  addSeller=new FormGroup({
    name:new FormControl('',Validators.required),
    email:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)

  })

  signUp(){
    console.log(this.addSeller.value);
  
      this.close=true;
      this.addSeller.reset()
   
  }
}
