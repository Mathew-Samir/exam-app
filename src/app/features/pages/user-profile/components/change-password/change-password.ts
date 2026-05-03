import { Component, inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { PasswordModule } from "primeng/password";
import { MessageService } from "primeng/api";
import { ProfileService } from "../../../../../core/services/profile/profile.service";

@Component({
  selector: "app-change-password",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: "./change-password.html",
  styleUrl: "./change-password.scss",
})
export class ChangePassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly profileService = inject(ProfileService);

  passwordForm!: FormGroup;
  loading = signal<boolean>(false);

  ngOnInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ["", [Validators.required, Validators.minLength(6)]],
      newPassword: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading.set(true);
      this.profileService.changePassword(this.passwordForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: res.message || "Password updated successfully",
          });
          this.loading.set(false);
          this.passwordForm.reset();
        },
        error: () => this.loading.set(false),
      });
    }
  }
}
