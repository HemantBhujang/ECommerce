import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './auth.guard';
import { ViewprofileComponent } from './components/viewprofile/viewprofile.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminLoginComponent } from './components/Admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard.component';

import { DashboardContentComponent } from './components/Admin/dashboard-content/dashboard-content.component';
import { AdminProductsComponent } from './components/Admin/admin-products/admin-products.component';
import { adminAuthGuard } from '../admin-auth.guard';
import { AdminAddProductsComponent } from './components/Admin/admin-add-products/admin-add-products.component';
import { AdminViewProductComponent } from './components/Admin/admin-view-product/admin-view-product.component';
import { AdminEditProductComponent } from './components/Admin/admin-edit-product/admin-edit-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { ParentCategoryProductsComponent } from './components/parent-category-products/parent-category-products.component';
import { MainCategoryProductsComponent } from './components/main-category-products/main-category-products.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PaymentComponent } from './components/payment/payment.component';
import { OrderConfirmedComponent } from './components/order-confirmed/order-confirmed.component';
import { OnlinePaymentComponent } from './components/online-payment/online-payment.component';
import { AdminUsersComponent } from './components/Admin/admin-users/admin-users.component';
import { OrderComponent } from './components/order/order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
// import { PaymentOneProductComponent } from './components/payment-one-product/payment-one-product.component';
// import { CashOneProductComponent } from './components/cash-one-product/cash-one-product.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
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
      {path:'products', component:AdminProductsComponent},
      {path :'addproducts' , component:AdminAddProductsComponent},
      {path:'viewproducts/:id' , component:AdminViewProductComponent},
      {path :'editproducts/:id',component:AdminEditProductComponent},
       {path :'admin-users', component: AdminUsersComponent}
    ]
  
},
// {path:"payment",component:PaymentComponent,canActivate: [AuthGuard]},
{path:"checkout/:id",component:CheckoutComponent,canActivate:[AuthGuard]},
{path:"checkout",component:CheckoutComponent,canActivate:[AuthGuard]},

{path:'order-confirmed',component:OrderConfirmedComponent,canActivate: [AuthGuard]},
{path:'order-confirmed/:id',component:OrderConfirmedComponent,canActivate: [AuthGuard]},
{path:'online-payment',component:OnlinePaymentComponent,canActivate: [AuthGuard]},
{path:'online-payment/:id',component:OnlinePaymentComponent,canActivate: [AuthGuard]},
// {path:"payment-one-product/:id",component:PaymentOneProductComponent,canActivate:[AuthGuard]},
// {path:"cash-one-product/:id",component:CashOneProductComponent,canActivate:[AuthGuard]},
{path:'online-order',component:OrderComponent,canActivate: [AuthGuard]},
{path:"cart", component:CartComponent},
{path:"wishlist", component:WishlistComponent},
{path :"product-details/:id", component:ProductDetailsComponent},
{ path: ':category/:parent/:sub', component: CategoryProductsComponent },
{ path: ':category/:parent', component: ParentCategoryProductsComponent },
{ path: 'not-found', component: NotFoundComponent },
{ path: ':category', component: MainCategoryProductsComponent },
{ path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
