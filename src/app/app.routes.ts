import {Routes} from "@angular/router";

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./features/auth/pages/login/login").then((m) => m.Login),
        title: "Login",
    },
    {
        path: "login",
        loadComponent: () => import("./features/auth/pages/login/login").then((m) => m.Login),
        title: "Login",
    },
    {
        path: "signup",
        loadComponent: () => import("./features/auth/pages/sign-up/sign-up").then((m) => m.SignUp),
        title: "SignUp",
    },
    {
        path: "reset-password",
        loadComponent: () =>
            import("./features/auth/pages/reset-password/reset-password").then(
                (m) => m.ResetPassword
            ),
        title: "Reset Password",
    },
];
