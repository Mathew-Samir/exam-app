import { Component, output, signal, inject, OnInit, OnDestroy } from "@angular/core";
import { Button } from "../../../../../../shared/components/ui/button/button";
import { RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from "@angular/forms";
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-verify-otp",
    standalone: true,
    imports: [Button, RouterLink, InputOtpModule, ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: "./verify-otp.html",
    styleUrl: "./verify-otp.scss",
})
export class VerifyOtp implements OnInit, OnDestroy {

  private readonly fb = inject(FormBuilder);

  next = output<void>();

  // Timer signal (60 seconds)
  countdown = signal<number>(60);
  private timerInterval: any;

  // Define form for OTP
  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.countdown.set(60);
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.countdown.update(val => {
        if (val <= 1) {
          this.stopTimer();
          return 0;
        }
        return val - 1;
      });
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onResend() {
    if (this.countdown() === 0) {
      console.log('Resending OTP...');
      this.startTimer();
    }
  }

  onVerify() {
    if (this.otpForm.valid) {
      console.log('Verifying OTP:', this.otpForm.value.otp);
      this.next.emit();
    } else {
      this.otpForm.get('otp')?.markAsTouched();
    }
  }
}


