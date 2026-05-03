import { Component } from "@angular/core";
import { DashboardHeader } from "./components/dashboard-header/dashboard-header";
import { DashboardSidebar } from "./components/dashboard-sidebar/dashboard-sidebar";
import { RouterOutlet } from "@angular/router";


@Component({
    selector: "app-dashboard",
    imports: [DashboardHeader, DashboardSidebar, RouterOutlet],
    templateUrl: "./dashboard.html",
    styleUrl: "./dashboard.scss",
})
export class Dashboard {}
