import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './auth.guard';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"register",
    component:RegisterComponent
  },{
    path:'user-home',
    component:UserHomeComponent
  },{
    path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthGuard]
  },
  { path: 'userProfile', component: ViewprofileComponent, canActivate: [AuthGuard] },
{ path: 'edit-profile/:id', component: EditProfileComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
