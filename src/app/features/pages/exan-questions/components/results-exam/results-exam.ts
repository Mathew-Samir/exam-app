import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ChartModule } from "primeng/chart";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { SkeletonModule } from "primeng/skeleton";
import { SubmissionsService } from "../../../../../core/services/submissions/submissions.service";
import { Submission, Analytics } from "../../../../../core/interfaces/submissions.interface";

/**
 * ResultsExam Component
 * Displays exam submission results including a doughnut chart summary
 * and a detailed analytics list of each question with correct/incorrect answers.
 */
@Component({
  selector: "app-results-exam",
  imports: [ChartModule, ButtonModule, RadioButtonModule, FormsModule, SkeletonModule],
  templateUrl: "./results-exam.html",
  styleUrl: "./results-exam.scss",
})
export class ResultsExam implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly submissionsService = inject(SubmissionsService);

  /** Submission data from API */
  submission = signal<Submission | null>(null);
  /** Detailed analytics for each question */
  analytics = signal<Analytics[]>([]);
  /** Loading state flag */
  isLoading = signal(true);

  /** Route params stored as signals */
  diplomaId = signal<string | null>(null);
  examId = signal<string | null>(null);

  /** Computed chart data derived from submission results */
  chartData = computed(() => {
    const sub = this.submission();
    if (!sub) return null;

    return {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [sub.correctAnswers, sub.wrongAnswers],
          backgroundColor: ["#00B87C", "#F44336"],
          hoverBackgroundColor: ["#009664", "#D32F2F"],
          borderWidth: 0,
          weight: 0.5,
        },
      ],
    };
  });

  /** Chart.js configuration options */
  chartOptions = {
    cutout: "80%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    maintainAspectRatio: false,
  };

  ngOnInit(): void {
    // Extract route params for navigation
    this.route.paramMap.subscribe((params) => {
      this.diplomaId.set(params.get("diplomaId"));
      this.examId.set(params.get("examId"));
    });

    // Load results based on submissionId query param
    this.route.queryParams.subscribe((params) => {
      const submissionId = params["submissionId"];
      if (submissionId) {
        this.loadResults(submissionId);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Fetches submission results and analytics from the API
   * @param id - Submission ID to fetch
   */
  loadResults(id: string): void {
    this.isLoading.set(true);
    this.submissionsService.getSubmissionById(id).subscribe({
      next: (res) => {
        if (res.status) {
          this.submission.set(res.payload.submission);
          this.analytics.set(res.payload.analytics);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error loading results:", err);
        this.isLoading.set(false);
      },
    });
  }

  /** Navigate back to the exam questions to retake */
  restart(): void {
    const dId = this.diplomaId();
    const eId = this.examId();
    if (dId && eId) {
      this.router.navigate(["/dashboard/diplomas", dId, "exams", eId, "questions"]);
    }
  }

  /** Navigate back to the exams list to explore other exams */
  explore(): void {
    const dId = this.diplomaId();
    if (dId) {
      this.router.navigate(["/dashboard/diplomas", dId, "exams"]);
    } else {
      this.router.navigate(["/dashboard/diplomas"]);
    }
  }
}
