import { Component, inject, signal, ChangeDetectionStrategy, computed } from "@angular/core";
import { Router } from "@angular/router";
import { AuthFacade } from "../../../../core/services/auth/auth.facade";
import { AuthFlow } from "../../../../core/enums/auth-flow";
import { SendEmail } from "../../components/send-email/send-email";
import { ConfirmEmail } from "../../components/confirm-email/confirm-email";
import { CreateAccount } from "../../components/create-account/create-account";
import { CreateNewPassword } from "../../components/create-new-password/create-new-password";
import { Stepper } from "../../../../shared/components/ui/stepper/stepper";
import { MessageService } from "primeng/api";

/** Sign Up flow steps (0-indexed for stepper compatibility) */
export enum AuthStep {
  SendEmail = 0,
  ConfirmEmail = 1,
  CreateAccount = 2,
  CreateNewPassword = 3,
}

/**
 * Smart container for the Sign Up flow.
 * Orchestrates step transitions and delegates API calls to AuthFacade.
 */
@Component({
  selector: "app-sign-up",
  imports: [SendEmail, ConfirmEmail, CreateAccount, CreateNewPassword, Stepper],
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
      case AuthStep.ConfirmEmail: return 'Verify OTP';
      case AuthStep.CreateAccount: return 'Tell us more about you';
      case AuthStep.CreateNewPassword: return 'Create a strong password';
      default: return '';
    }
  });

  /** Accumulated account data across steps */
  private signupData = { firstName: "", lastName: "", username: "", phone: "" };

  // -- Expose enums to template --
  protected readonly AuthStep = AuthStep;
  protected readonly AuthFlow = AuthFlow;

  /** Step 1: Send verification email */
  onSendEmail(data: { email: string }): void {
    this.authFacade.sendEmailVerification({ email: data.email }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.email.set(data.email);
          this.currentStep.set(AuthStep.ConfirmEmail);
        }
      },
    });
  }

  /** Step 2: Confirm email verification code */
  onConfirmEmail(data: { code: string }): void {
    this.authFacade.confirmEmailVerification({ email: this.email(), code: data.code }).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.currentStep.set(AuthStep.CreateAccount);
        }
      },
    });
  }

  /** Step 3: Collect account info (no API call, local transition) */
  onCreateAccount(data: { firstName: string; lastName: string; username: string; phone: string }): void {
    this.signupData = { ...data };
    this.currentStep.set(AuthStep.CreateNewPassword);
  }

  /** Step 4: Create password & register */
  onCreatePassword(data: { password: string; rePassword: string }): void {
    const payload = {
      ...this.signupData,
      email: this.email(),
      password: data.password,
      confirmPassword: data.rePassword,
    };

    this.authFacade.register(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Account created successfully! Welcome to Elevate.",
          });
          setTimeout(() => this.router.navigate(["/login"]), 2000);
        }
      },
    });
  }

  /** Navigate to previous step */
  goBack(): void {
    const stepMap: Record<number, AuthStep> = {
      [AuthStep.ConfirmEmail]: AuthStep.SendEmail,
      [AuthStep.CreateAccount]: AuthStep.ConfirmEmail,
      [AuthStep.CreateNewPassword]: AuthStep.CreateAccount,
    };
    const prev = stepMap[this.currentStep()];
    if (prev !== undefined) this.currentStep.set(prev);
  }
}
