import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  message: string = '';

  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone_number: new FormControl(''),
    nationality: new FormControl(''),
    address: new FormControl('')
  });

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          name: res.name,
          email: res.email,
          phone_number: res.phone_number,
          nationality: res.nationality,
          address: res.address
        });
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }
  

  onSubmit() {
    // if (this.profileForm.valid) {
    //   this.profileService.updateProfile(this.profileForm.value).subscribe({
    //     next: (res) => {
    //       this.message = res.message || 'Profile updated successfully!';
    //     },
    //     error: (err) => {
    //       this.message = 'Error updating profile';
    //       console.error(err);
    //     }
    //   });
    //}
  }
}
