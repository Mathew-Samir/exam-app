import { Component, inject, OnInit, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { MenuItem } from "primeng/api";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ProfileService, UserProfile } from "../../../../core/services/profile/profile.service";

@Component({
  selector: "app-dashboard-sidebar",
  standalone: true,
  imports: [ButtonModule, MenuModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./dashboard-sidebar.html",
  styleUrl: "./dashboard-sidebar.scss",
})
export class DashboardSidebar implements OnInit {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);

  items: MenuItem[] | undefined;
  user = signal<UserProfile | null>(null);

  ngOnInit() {
    this.loadProfile();
    this.items = [
      {
        label: "Account",
        icon: "pi pi-user",
        command: () => {
          this.router.navigate(["/dashboard/user-profile"]);
        },
      },
      {
        label: "Dashboard",
        icon: "pi pi-cog",
        command: () => {
          this.router.navigate(["/dashboard"]);
        },
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        styleClass: "logout-item",
        command: () => {
          this.logout();
        },
      },
    ];
  }

  loadProfile() {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        const userData = res.payload?.user;
        if (userData) {
          this.user.set(userData);
        }
      },
    });
  }

  logout() {
    // Clear token
    localStorage.removeItem("token");
    // Redirect to login
    this.router.navigate(["/auth/login"]);
  }
}
