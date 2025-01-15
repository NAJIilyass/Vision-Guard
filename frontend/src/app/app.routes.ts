import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: '', component: HomeComponent, canActivate: [authGuard] }, // Closing bracket fixed here
    { path: '**', redirectTo: 'login' } // Redirect unknown routes to login
];
