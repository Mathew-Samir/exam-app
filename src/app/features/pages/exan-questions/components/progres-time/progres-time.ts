import { Component, input, signal, OnInit, OnDestroy, computed, output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-progres-time",
    imports: [CommonModule],
    templateUrl: "./progres-time.html",
    styleUrl: "./progres-time.scss",
})
export class ProgresTime implements OnInit, OnDestroy {
    duration = input.required<number>(); // in minutes
    remainingSeconds = signal<number>(0);
    onTimeUp = output<void>();
    private timerInterval: ReturnType<typeof setInterval> | null = null;

    ngOnInit() {
        this.remainingSeconds.set(this.duration() * 60);
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.remainingSeconds() > 0) {
                this.remainingSeconds.update(s => s - 1);
            } else {
                this.stopTimer();
                this.onTimeUp.emit();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    formattedTime = computed(() => {
        const minutes = Math.floor(this.remainingSeconds() / 60);
        const seconds = this.remainingSeconds() % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    progressValue = computed(() => {
        const total = this.duration() * 60;
        return ((total - this.remainingSeconds()) / total) * 100;
    });
}
