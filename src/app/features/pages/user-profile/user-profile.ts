import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserSidbar } from "./components/user-sidbar/user-sidbar";
import { UserInfo } from "./components/user-info/user-info";
import { ChangePassword } from "./components/change-password/change-password";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogVerifyEmail } from "./components/dialog-verify-email/dialog-verify-email";

@Component({
  selector: "app-user-profile",
  imports: [CommonModule, UserSidbar, UserInfo, ChangePassword],
  providers: [DialogService],
  templateUrl: "./user-profile.html",
  styleUrl: "./user-profile.scss",
})
export class UserProfile {
  private readonly dialogService = inject(DialogService);

  activeView = signal<string>("profile"); // 'profile' or 'change-password'
  ref: DynamicDialogRef | null | undefined;

  onProfileClick() {
    this.activeView.set("profile");
  }

  onChangePasswordClick() {
    this.activeView.set("change-password");
  }
}
