import { NgOptimizedImage, Location, CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { MenuItem } from "primeng/api";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { filter } from "rxjs";

@Component({
  selector: "app-dashboard-header",
  imports: [BreadcrumbModule, RouterLink, NgOptimizedImage, CommonModule],
  templateUrl: "./dashboard-header.html",
  styleUrl: "./dashboard-header.scss",
})
export class DashboardHeader implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);

  items = signal<MenuItem[] | undefined>(undefined);
  home: MenuItem | undefined;

  currentTitle = computed(() => {
    const breadcrumbs = this.items();
    if (!breadcrumbs || breadcrumbs.length === 0) return "Dashboard";
    return breadcrumbs[breadcrumbs.length - 1].label;
  });

  currentIcon = computed(() => {
    const title = this.currentTitle()?.toLowerCase() || "";
    if (title.includes("profile")) return "/images/user-round.svg";
    return "/images/graduation-cap.svg";
  });

  ngOnInit() {
    this.home = { routerLink: "/dashboard" };
    this.updateBreadcrumbs();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  goBack() {
    this.location.back();
  }

  private updateBreadcrumbs() {
    this.items.set(this.createBreadcrumbs(this.activatedRoute.root));
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join("/");
      let nextUrl = url;
      if (routeURL !== "") {
        nextUrl += `/${routeURL}`;
      }

      const title = child.snapshot.title;
      if (title && title !== breadcrumbs[breadcrumbs.length - 1]?.label) {
        breadcrumbs.push({ label: title, routerLink: nextUrl });
      }

      return this.createBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}
