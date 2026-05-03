import {Component, ChangeDetectionStrategy, output, inject, input, OnInit, signal, computed} from "@angular/core";
import {FormBuilder, Validators, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Button} from "../../../../shared/components/ui/button/button";
import {InputComponent} from "../../../../shared/components/ui/input/input";
import {AuthFlow} from "../../../../core/enums/auth-flow";
import {AuthFacade} from "../../../../core/services/auth/auth.facade";
import {RegisterRequest} from "msr-auth";
import {MessageService} from "primeng/api";

/**
 * Presentational component: password creation step.
 * Shared across Sign Up (create password) and Reset Password (new password) flows.
 * Includes cross-field validation for password matching.
 */
@Component({
    selector: "app-create-new-password",
    imports: [Button, InputComponent, ReactiveFormsModule],
    templateUrl: "./create-new-password.html",
    styleUrl: "./create-new-password.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewPassword implements OnInit {
    isLoading = signal<boolean>(false);
    submitted = output<{password: string; rePassword: string}>();

    protected readonly AuthFlow = AuthFlow;
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authFacade = inject(AuthFacade);
    private readonly messageService = inject(MessageService);

    private token = signal<string | null>(null);

    /** Determine flow dynamically if not provided via input */
    readonly flow = computed(() => {
        if (this.token()) return AuthFlow.Reset;
        if (this.authFacade.registrationData()) return AuthFlow.Signup;
        return AuthFlow.Reset;
    });

    /** Password form with cross-field mismatch validator */
    passwordForm = this.fb.group(
        {
            password: [
                "",
                [
                    Validators.required,
                    Validators.pattern(
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
                    ),
                ],
            ],
            rePassword: ["", [Validators.required]],
        },
        {
            validators: (group: import("@angular/forms").AbstractControl) => {
                const password = group.get("password")?.value;
                const confirm = group.get("rePassword")?.value;
                return password === confirm ? null : {mismatch: true};
            },
        }
    );

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params["token"]) {
                this.token.set(params["token"]);
            }
        });
    }

    /** Validate and submit passwords */
    onSubmit(): void {
        if (this.passwordForm.valid) {
            const {password, rePassword} = this.passwordForm.getRawValue();
            
            if (this.token()) {
                // Scenario A: Reset Password (token-based)
                this.isLoading.set(true);
                this.authFacade.resetPassword({
                    token: this.token()!,
                    newPassword: password!,
                    confirmPassword: rePassword!
                }).subscribe({
                    next: (res) => {
                        if (res.status) {
                            this.messageService.add({
                                severity: "success",
                                summary: "Success",
                                detail: "Password reset successful! Redirecting to login...",
                            });
                            setTimeout(() => this.router.navigate(["auth/login"]), 2000);
                        }
                        this.isLoading.set(false);
                    },
                    error: () => this.isLoading.set(false)
                });
            } else if (this.authFacade.registrationData()) {
                // Scenario B: Sign Up Completion (data-based)
                const regData = this.authFacade.registrationData() as RegisterRequest;
                const payload: RegisterRequest = {
                    ...regData,
                    password: password!,
                    confirmPassword: rePassword!,
                };

                this.isLoading.set(true);
                this.authFacade.register(payload).subscribe({
                    next: (res) => {
                        if (res.status) {
                            this.messageService.add({
                                severity: "success",
                                summary: "Success",
                                detail: "Account created successfully! Welcome to Elevate.",
                            });
                            // Clear temp data
                            this.authFacade.setRegistrationData(null);
                            setTimeout(() => this.router.navigate(["auth/login"]), 2000);
                        }
                        this.isLoading.set(false);
                    },
                    error: () => this.isLoading.set(false)
                });
            } else {
                // Scenario C: Invalid state
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Invalid session. Please start the process again.",
                });
                this.router.navigate(["/auth/login"]);
            }
        } else {
            this.passwordForm.markAllAsTouched();
        }
    }
}
