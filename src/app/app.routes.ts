import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    { path:"", redirectTo:"login", pathMatch:"full" },
    { path:"login", component:Login },
    { path:"home", component:HomeComponent, canActivate: [authGuard] },
    { path:"dashboard", component:DashboardComponent, canActivate: [authGuard] }
];
