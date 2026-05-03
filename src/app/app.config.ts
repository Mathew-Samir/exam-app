import {ApplicationConfig, provideBrowserGlobalErrorListeners} from "@angular/core";
import {provideRouter} from "@angular/router";
import {provideAnimations} from "@angular/platform-browser/animations";
import {providePrimeNG} from "primeng/config";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import Aura from "@primeuix/themes/aura";
import {routes} from "./app.routes";
import {provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideMsrAuth} from "msr-auth";
import {httpResponseInterceptor} from "./core/interceptors/http-response/http-response-interceptor";
import {headerInterceptor} from "./core/interceptors/header/header-interceptor";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideAnimations(),
        MessageService,
        ConfirmationService,
        DialogService,
        provideHttpClient(withInterceptors([headerInterceptor, httpResponseInterceptor]), withFetch()),
        provideMsrAuth({
            baseUrl: "https://exam-app.elevate-bootcamp.cloud/api",
            endpoints: {
                login: "auth/login",
                register: "auth/register",
                forgotPassword: "auth/forgot-password",
                resetPassword: "auth/reset-password",
                sendEmailVerification: "auth/send-email-verification",
                confirmEmailVerification: "auth/confirm-email-verification",
            },
        }),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: "p",
                    darkModeSelector: "light-mode",
                    cssLayer: false,
                },
            },
        }),
    ],
};
