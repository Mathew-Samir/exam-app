import { ChangeDetectorRef, Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ProfileService, UserProfile } from "../../../../../core/services/profile/profile.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogVerifyEmail } from "../dialog-verify-email/dialog-verify-email";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { Router } from "@angular/router";

import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-user-info",
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, SkeletonModule, ConfirmDialogModule],
  templateUrl: "./user-info.html",
  styleUrl: "./user-info.scss",
})
export class UserInfo implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly messageService = inject(MessageService);
  private readonly dialogService = inject(DialogService);
  public readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  loading = signal<boolean>(false);
  user = signal<UserProfile | null>(null);
  ref: DynamicDialogRef | null | undefined;

  ngOnInit() {
    this.initForm();
    this.loadProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      username: [{ value: "", disabled: true }],
      email: [{ value: "", disabled: true }, [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
    });
  }

  loadProfile() {
    this.loading.set(true);
    this.profileService.getProfile().subscribe({
      next: (res) => {
        const userData = res.payload?.user;
        console.log("Loaded Profile Data:", userData);
        if (userData) {
          this.user.set(userData);
          this.profileForm.patchValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
          });
          this.cdr.detectChanges();
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Error loading profile:", err);
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.loading.set(true);
      const payload = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
      };
      this.profileService.updateProfile(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Profile updated successfully",
          });
          this.profileForm.markAsPristine();
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  changeEmail() {
    this.ref = this.dialogService.open(DialogVerifyEmail, {
      header: "Change Email",
      width: "500px",
      closable: true,
      closeOnEscape: true,
      contentStyle: { overflow: "auto" },
      breakpoints: {
        "960px": "75vw",
        "640px": "90vw",
      },
    });

    this.ref?.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadProfile(); // Reload profile if email changed
      }
    });
  }

  deleteAccount() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete your account?",
      header: "Delete Account",
    });
  }

  confirmDelete() {
    this.loading.set(true);
    this.profileService.deleteAccount().subscribe({
      next: (res) => {
        this.messageService.add({
          severity: "success",
          summary: "Deleted",
          detail: res.message || "Account deleted successfully",
        });
        this.confirmationService.close();
        this.router.navigate(["/auth/login"]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
