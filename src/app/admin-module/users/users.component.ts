import { Component } from '@angular/core';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
 users: any = null;
     error: string = '';
     constructor(private userService: UsersService){}

     id:number=0;
     name ='';
    email = '';
    phone_number='';
    nationality='';
     address='';

     ngOnInit(){
      this.getUserData();    
     }
     getUserData() {
      this.userService.getUsers().subscribe({
        next: (data) => {
          console.log(data);
          this.users = data; // correctly keep it as an array
        },
        error: (err) => {
          console.error('Error fetching profile', err);
          this.error = 'Failed to load profile. Please log in again.';
        },
      });
    }
}
