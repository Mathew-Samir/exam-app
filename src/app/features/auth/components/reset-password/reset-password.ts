import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgetPassword } from "./components/forget-password/forget-password";
import { VerifyOtp } from "./components/verify-otp/verify-otp";
import { CreateNewPassword } from "./components/create-new-password/create-new-password";
import { RouterLink } from "@angular/router";

/**
 * Steps Enum for Reset Password Flow
 */
export enum ResetPasswordStep {
  ForgetPassword = 'forget-password',
  VerifyOtp = 'verify-otp',
  CreateNewPassword = 'create-new-password'
}

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [
    CommonModule,
    ForgetPassword,
    VerifyOtp,
    CreateNewPassword,
    RouterLink
  ],

  templateUrl: "./reset-password.html",
  styleUrl: "./reset-password.scss",
})
export class ResetPassword {
  // Expose Enum to Template
  protected readonly ResetPasswordStep = ResetPasswordStep;

  // Current step state using Angular Signals for high performance
  readonly currentStep = signal<ResetPasswordStep>(ResetPasswordStep.ForgetPassword);

  /**
   * Dynamic Title based on current step
   */
  readonly title = computed(() => {
    switch (this.currentStep()) {
      case ResetPasswordStep.ForgetPassword:
        return 'Forget password?';
      case ResetPasswordStep.VerifyOtp:
        return 'Verify OTP';
      case ResetPasswordStep.CreateNewPassword:
        return 'Set new password';
      default:
        return 'Reset Password';
    }
  });

  /**
   * Dynamic Description based on current step
   */
  readonly description = computed(() => {
    switch (this.currentStep()) {
      case ResetPasswordStep.ForgetPassword:
        return 'Don’t worry, we will help you recover your account.';
      case ResetPasswordStep.VerifyOtp:
        return 'Please enter the 6-digits code we have sent to:';
      case ResetPasswordStep.CreateNewPassword:
        return 'Create a new strong password for your account.';
      default:
        return '';
    }
  });

  /**
   * Navigation method to change steps
   */
  setStep(step: ResetPasswordStep): void {
    this.currentStep.set(step);
  }

  // Helper methods for navigation (called via event binding from child components)
  moveToVerifyOtp(): void {
    this.setStep(ResetPasswordStep.VerifyOtp);
  }

  moveToCreatePassword(): void {
    this.setStep(ResetPasswordStep.CreateNewPassword);
  }

  /**
   * Go back to previous step
   */
  goBack(): void {
    if (this.currentStep() === ResetPasswordStep.VerifyOtp) {
      this.setStep(ResetPasswordStep.ForgetPassword);
    } else if (this.currentStep() === ResetPasswordStep.CreateNewPassword) {
      this.setStep(ResetPasswordStep.VerifyOtp);
    }
  }
}


