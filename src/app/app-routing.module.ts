import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './auth.guard';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminLoginComponent } from './components/Admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';
import { adminAuthGuard } from './admin-auth.guard';
import { MenCategoryComponent } from './men-category/men-category.component';
import { WomenCategoryComponent } from './women-category/women-category.component';
import { KidsCategoryComponent } from './kids-category/kids-category.component';



const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"register",
    component:RegisterComponent
  },
  { path: 'userProfile', component: ViewprofileComponent, canActivate: [AuthGuard] },
{path:"orders",component: OrdersComponent,canActivate:[AuthGuard]},
{path : "adminLogin" , component:AdminLoginComponent
},
{
  path:"adminDashboard" , component: AdminDashboardComponent,
    canActivate: [adminAuthGuard]
  
},
{ path: 'menCategory', component: MenCategoryComponent },
{ path: 'womenCategory', component: WomenCategoryComponent },
{ path: 'kidsCategory', component: KidsCategoryComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
