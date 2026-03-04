import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login'
import { ResetPassword } from './features/auth/components/reset-password/reset-password';
import { SignUp } from './features/auth/components/sign-up/sign-up';


export const routes: Routes = [
    { path: "",component: Login },
    { path: "login",component: Login },
    { path: "reset-password",component: ResetPassword },
    { path: "signup",component: SignUp }
];
