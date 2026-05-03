import {Component, DestroyRef, inject} from "@angular/core";
import {Button} from "../../../../shared/components/ui/button/button";
import {InputComponent} from "../../../../shared/components/ui/input/input";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MsrAuth} from "msr-auth";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MessageService} from "primeng/api";

@Component({
    selector: "app-login",
    imports: [Button, InputComponent, RouterLink, ReactiveFormsModule],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly msAuthService = inject(MsrAuth);
    private readonly destroyRef = inject(DestroyRef);
    private readonly messageService = inject(MessageService);

    // Define login form with validations
    loginForm = this.fb.group({
        username: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(6)]],
    });

    onSubmit() {
        if (this.loginForm.valid) {
            const {username, password} = this.loginForm.value;

            this.msAuthService
                .login({
                    username: username!,
                    password: password!,
                })
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: any) => {
                        if (response.status && response.payload?.token) {
                            // Save token to localStorage
                            localStorage.setItem("token", response.payload.token);

                            // Show success message
                            this.messageService.add({
                                severity: "success",
                                summary: "Login Success",
                                detail: `Welcome back, ${response.payload.user.firstName}!`,
                            });

                            // Navigate to dashboard
                            this.router.navigate(["/dashboard"]);
                        }
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Login Failed",
                            detail: err.error?.message || "Invalid username or password",
                        });
                    },
                });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
