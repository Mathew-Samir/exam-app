import { ChangeDetectorRef, Component, computed, inject, input, OnInit, output, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

import { ProfileService, UserProfile } from "../../../../../core/services/profile/profile.service";

@Component({
  selector: "app-user-sidbar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./user-sidbar.html",
  styleUrl: "./user-sidbar.scss",
})
export class UserSidbar implements OnInit {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  private readonly cdr = inject(ChangeDetectorRef);

  user = signal<UserProfile | null>(null);

  userInitials = computed(() => {
    const u = this.user();
    if (!u) return "";
    const f = u.firstName?.charAt(0) || "";
    const l = u.lastName?.charAt(0) || "";
    return (f + l).toUpperCase();
  });

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        const userData = res.payload?.user;
        if (userData) {
          this.user.set(userData);
          this.cdr.detectChanges();
        }
      },
    });
  }

  activeView = input<string>("profile");
  profileClicked = output<void>();
  changePasswordClicked = output<void>();

  onProfileClick() {
    this.profileClicked.emit();
  }

  onChangePasswordClick() {
    this.changePasswordClicked.emit();
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/auth/login"]);
  }
}
