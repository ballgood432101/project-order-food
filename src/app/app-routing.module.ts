import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { StaffOrAdminGuard } from './guards/staff-or-admin.guard';
import { HistoryComponent } from './pages/history/history.component';
import { FavourtiesComponent } from './pages/favourties/favourties.component';
import { ReviewComponent } from './pages/review/review.component';
import { PromotionComponent } from './pages/promotion/promotion.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'favourites',
    component: FavourtiesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reviews',
    component: ReviewComponent,
  },
  {
    path: 'promotions',
    component: PromotionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
