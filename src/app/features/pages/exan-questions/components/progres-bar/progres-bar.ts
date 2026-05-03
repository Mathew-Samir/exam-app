import { Component, input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressBar } from "primeng/progressbar";

@Component({
    selector: "app-progres-bar",
    imports: [CommonModule, ProgressBar],
    templateUrl: "./progres-bar.html",
    styleUrl: "./progres-bar.scss",
})
export class ProgresBar {
    current = input.required<number>();
    total = input.required<number>();
    title = input.required<string>();

    progressValue = computed(() => (this.current() / this.total()) * 100);
}
