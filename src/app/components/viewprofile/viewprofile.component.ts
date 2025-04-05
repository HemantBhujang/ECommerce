import { Component } from '@angular/core';
import { ProfileService } from 'src/app/Services/profile.service';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent {
  user: any = null;
  error: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching profile', err);
        this.error = 'Failed to load profile. Please log in again.';
      },
    });
  }
}
