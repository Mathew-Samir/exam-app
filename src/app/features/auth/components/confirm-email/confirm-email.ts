import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputOtpModule } from "primeng/inputotp";
import { AuthStep } from "../../pages/sign-up/sign-up";

/**
 * Presentational component: OTP verification step.
 * Manages a 60-second countdown timer for resend logic.
 */
@Component({
  selector: "app-confirm-email",
  imports: [Button, InputOtpModule, FormsModule],
  templateUrl: "./confirm-email.html",
  styleUrl: "./confirm-email.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmEmail implements OnInit, OnDestroy {
  // -- Inputs --
  isLoading = input<boolean>(false);
  email = input<string>("");

  // -- Outputs --
  submitted = output<{ code: string }>();
  resend = output<void>();
  back = output<void>();

  // -- Local state --
  code = "";
  countdown = signal<number>(60);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  /** Start or restart the 60s countdown timer */
  startCountdown(): void {
    this.countdown.set(60);
    this.stopCountdown();
    this.timerInterval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update((v) => v - 1);
      } else {
        this.stopCountdown();
      }
    }, 1000);
  }

  /** Clear the interval timer */
  stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Emit verification code */
  onSubmit(): void {
    if (this.code.length >= 6) {
      this.submitted.emit({ code: this.code });
    }
  }

  /** Handle OTP auto-complete event */
  onCodeComplete(event: any): void {
    this.code = event.value;
    this.onSubmit();
  }

  /** Resend verification code and restart timer */
  resendCode(): void {
    this.resend.emit();
    this.startCountdown();
  }

   /** Navigate to previous step for editing */
   onEdit(): void {
     this.back.emit();
   }
}
