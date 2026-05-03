import {Routes} from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { homeGuard } from "./core/guards/home.guard";

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
{
  path: "auth",
  canActivate: [homeGuard],
  loadComponent:()=>
    import("./features/auth/auth").then((m) => m.Auth),
  title: "Auth",
  children:[
    { path: '', redirectTo: 'login', pathMatch: 'full' },
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
    {
        path: "create-new-password",
        loadComponent: () =>
            import("./features/auth/components/create-new-password/create-new-password").then(
                (m) => m.CreateNewPassword
            ),
        title: "Create New Password",
    },]
},
    {
        path: "dashboard",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./layouts/dashboard/dashboard").then((m) => m.Dashboard),
        title: "Dashboard",
        children: [
            {
                path: "",
                redirectTo: "diplomas",
                pathMatch: "full",
            },
            {
                path: "diplomas",
                loadComponent: () => import("./features/pages/diplomas/diplomas").then((m) => m.Diplomas),
                title: "Diplomas",
            },
            {
                path: "diplomas/:diplomaId/exams",
                loadComponent: () => import("./features/pages/exams/exams").then((m) => m.Exams),
                title: "Exams",
            },
            {
                path: "diplomas/:diplomaId/exams/:examId/questions",
                loadComponent: () => import("./features/pages/exan-questions/exan-questions").then((m) => m.ExanQuestions),
                title: "ExanQuestions",
            },
            {
                path: "diplomas/:diplomaId/exams/:examId/results",
                loadComponent: () => import("./features/pages/exan-questions/components/results-exam/results-exam").then((m) => m.ResultsExam),
                title: "Results",
            },
            {
              path: "user-profile",
                loadComponent: () => import("./features/pages/user-profile/user-profile").then((m) => m.UserProfile),
                title: "User-Profile",
            },
        ],
    },
];
