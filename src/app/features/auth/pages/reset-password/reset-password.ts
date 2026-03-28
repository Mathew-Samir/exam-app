import {Component, inject, signal, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthFacade} from "../../../../core/services/auth/auth.facade";
import {AuthFlow} from "../../../../core/enums/auth-flow";
import {SendEmail} from "../../components/send-email/send-email";
import {CreateNewPassword} from "../../components/create-new-password/create-new-password";
import {PasswordResetSent} from "../../components/password-reset-sent/password-reset-sent";
import {MessageService} from "primeng/api";

/** Reset Password flow steps */
export enum ResetPasswordStep {
    SendEmail = "send-email",
    PasswordResetSent = "password-reset-sent",
    CreateNewPassword = "create-new-password",
}

/**
 * Smart container for the Reset Password flow.
 * Handles deep-linking via ?token= query param for email-based resets.
 */
@Component({
    selector: "app-reset-password",
    imports: [SendEmail, PasswordResetSent, CreateNewPassword, RouterLink],
    templateUrl: "./reset-password.html",
    styleUrl: "./reset-password.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
    private readonly authFacade = inject(AuthFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    // -- State --
    readonly currentStep = signal<ResetPasswordStep>(ResetPasswordStep.SendEmail);
    readonly isLoading = this.authFacade.loading;
    readonly email = signal<string>("");
    private resetToken: string | null = null;

    // -- Expose enums to template --
    protected readonly ResetPasswordStep = ResetPasswordStep;
    protected readonly AuthFlow = AuthFlow;

    /** Check for deep-link token on init */
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            if (params["token"]) {
                this.resetToken = params["token"];
                this.currentStep.set(ResetPasswordStep.CreateNewPassword);
            }
        });
    }

    /** Step 1: Request password reset email */
    onSendEmail(data: {email: string}): void {
        this.authFacade.forgotPassword({email: data.email}).subscribe({
            next: (res) => {
                if (res.status) {
                    this.email.set(data.email);
                    this.currentStep.set(ResetPasswordStep.PasswordResetSent);
                }
            },
        });
    }

    /** Step 3: Submit new password with token */
    onResetPassword(data: {password: string; rePassword: string}): void {
        if (!this.resetToken) {
            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Missing reset token. Please check your email link.",
            });
            return;
        }

        this.authFacade
            .resetPassword({
                token: this.resetToken,
                newPassword: data.password,
                confirmPassword: data.rePassword,
            })
            .subscribe({
                next: (res) => {
                    if (res.status) {
                        this.messageService.add({
                            severity: "success",
                            summary: "Success",
                            detail: "Password reset successful! Redirecting to login...",
                        });
                        setTimeout(() => this.router.navigate(["/login"]), 2000);
                    }
                },
            });
    }

    /** Navigate back from success page */
    goBack(): void {
        if (this.currentStep() === ResetPasswordStep.PasswordResetSent) {
            this.currentStep.set(ResetPasswordStep.SendEmail);
        }
    }

    onRegisterNavigate(): void {
        this.router.navigate(["/register"]);
    }
}
