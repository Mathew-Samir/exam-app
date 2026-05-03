import {Component, inject, signal, ChangeDetectionStrategy, computed} from "@angular/core";
import {Router} from "@angular/router";
import {AuthFacade} from "../../../../core/services/auth/auth.facade";
import {MsrAuth, AuthResponse} from "msr-auth";
import {AuthFlow} from "../../../../core/enums/auth-flow";
import {SendEmail} from "../../components/send-email/send-email";
import {ConfirmEmail} from "../../components/confirm-email/confirm-email";
import {CreateAccount} from "../../components/create-account/create-account";
import {Stepper} from "../../../../shared/components/ui/stepper/stepper";
import {MessageService} from "primeng/api";

/** Sign Up flow steps (0-indexed for stepper compatibility) */
export enum AuthStep {
    SendEmail = 0,
    ConfirmEmail = 1,
    CreateAccount = 2,
}

/**
 * Smart container for the Sign Up flow.
 * Orchestrates step transitions and delegates API calls to AuthFacade.
 */
@Component({
    selector: "app-sign-up",
    imports: [SendEmail, ConfirmEmail, CreateAccount, Stepper],
    templateUrl: "./sign-up.html",
    styleUrl: "./sign-up.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUp {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);
    private readonly messageService = inject(MessageService);

    // -- State --
    readonly currentStep = signal<AuthStep>(AuthStep.SendEmail);
    readonly showStepper = computed(() => this.currentStep() !== AuthStep.SendEmail);
    readonly isLoading = this.authFacade.loading;
    readonly email = signal<string>("");

    readonly subtitle = computed(() => {
        switch (this.currentStep()) {
            case AuthStep.ConfirmEmail:
                return "Verify OTP";
            case AuthStep.CreateAccount:
                return "Tell us more about you";
            default:
                return "";
        }
    });



    // -- Expose enums to template --
    protected readonly AuthStep = AuthStep;
    protected readonly AuthFlow = AuthFlow;

    /** Step 1: Send verification email */
    onSendEmail(data: {email: string}): void {
        this.authFacade.sendEmailVerification({email: data.email}).subscribe({
            next: (res: AuthResponse) => {
                if (res.status) {
                    this.email.set(data.email);
                    this.currentStep.set(AuthStep.ConfirmEmail);
                }
            },
        });
    }

    /** Step 2: Confirm email verification code */
    onConfirmEmail(data: {code: string}): void {
        this.authFacade.confirmEmailVerification({email: this.email(), code: data.code}).subscribe({
            next: (res: AuthResponse) => {
                if (res.status) {
                    this.currentStep.set(AuthStep.CreateAccount);
                }
            },
        });
    }

    /** Step 3: Collect account info and navigate to password creation */
    onCreateAccount(data: {
        firstName: string;
        lastName: string;
        username: string;
        phone: string;
    }): void {
        this.authFacade.setRegistrationData({
            ...data,
            email: this.email(),
        });
        this.router.navigate(["/auth/create-new-password"]);
    }


    /** Navigate to previous step */
    goBack(): void {
        const stepMap: Record<number, AuthStep> = {
            [AuthStep.ConfirmEmail]: AuthStep.SendEmail,
            [AuthStep.CreateAccount]: AuthStep.ConfirmEmail,
        };
        const prev = stepMap[this.currentStep()];
        if (prev !== undefined) this.currentStep.set(prev);
    }
}
