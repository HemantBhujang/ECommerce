import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './auth.guard';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminLoginComponent } from './components/Admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';

import { MenCategoryComponent } from './components/men-category/men-category.component';
import { WomenCategoryComponent } from './components/women-category/women-category.component';
import { KidsCategoryComponent } from './components/kids-category/kids-category.component';
import { DashboardContentComponent } from './components/Admin/dashboard-content/dashboard-content.component';
import { AdminProductsComponent } from './components/Admin/admin-products/admin-products.component';
import { adminAuthGuard } from '../admin-auth.guard';



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
    canActivate: [adminAuthGuard],
    children:[
      {path:'',redirectTo:'dashboard',pathMatch:'full'},
      {path:'dashboard',component:DashboardContentComponent},
      {path:'products', component:AdminProductsComponent}
    ]
  
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
