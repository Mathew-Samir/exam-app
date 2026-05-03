import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ProfileService } from "../../../../../core/services/profile/profile.service";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ConfirmEmail } from "../../../../auth/components/confirm-email/confirm-email";
import { MessageService } from "primeng/api";
import { Stepper } from "../../../../../shared/components/ui/stepper/stepper";

@Component({
  selector: "app-dialog-verify-email",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ConfirmEmail,
    Stepper
  ],
  templateUrl: "./dialog-verify-email.html",
  styleUrl: "./dialog-verify-email.scss",
})
export class DialogVerifyEmail {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);

  step = signal<number>(1); // 1: Email, 2: OTP
  emailForm: FormGroup;
  loading = signal<boolean>(false);

  constructor() {
    this.emailForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.emailForm.get("email")?.value;
  }

  sendOTP() {
    if (this.emailForm.valid) {
      this.loading.set(true);
      this.profileService.requestEmailChange(this.email).subscribe({
        next: (res) => {
          if (res.status !== false) {
            this.step.set(2);
            this.messageService.add({
              severity: "info",
              summary: "OTP Sent",
              detail: res.message || "Verification code has been sent to your new email",
            });
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  onOTPSubmitted(event: { code: string }) {
    this.loading.set(true);
    this.profileService
      .confirmEmailChange(event.code)
      .subscribe({
        next: (res) => {
          if (res) {
            this.ref.close(true);
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: "Operation successful",
            });
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  goBack() {
    this.step.set(1);
  }
}
