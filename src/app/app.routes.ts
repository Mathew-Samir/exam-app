import { Routes } from '@angular/router';




export const routes: Routes = [
    { path: "",loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login), title:"Login" },
    { path: "login",loadComponent: () => import('./features/auth/components/login/login').then(m => m.Login), title:"Login"},
    { path: "signup",loadComponent: () => import('./features/auth/components/sign-up/sign-up').then(m => m.SignUp), title:"SignUp"},
    { path: "reset-password",loadComponent: () => import('./features/auth/components/reset-password/reset-password').then(m => m.ResetPassword), title:"Reset Password"},

];
