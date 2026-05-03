import { Component, input, signal, computed } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Exam } from "../../../../../core/interfaces/diploma.interface";
import { ButtonModule } from "primeng/button";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-exam-row",
  imports: [CommonModule, NgOptimizedImage, ButtonModule, RouterLink],
  templateUrl: "./row-exam.html",
  styleUrl: "./row-exam.scss",
})
export class RowExam {
  exam = input.required<Exam>();
  diplomaId = input.required<string>();

  constructor(private router: Router) {}

  startExam() {
    this.router.navigate(['/dashboard/diplomas', this.diplomaId(), 'exams', this.exam().id, 'questions']);
  }

  isExpanded = signal(false);

  showSeeMore = computed(() => (this.exam().description?.length || 0) > 250);

  displayDescription = computed(() => {
    const desc = this.exam().description || '';
    if (this.isExpanded() || desc.length <= 250) {
      return desc;
    }
    return desc.substring(0, 250) + '...';
  });

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.isExpanded.update(v => !v);
  }
}

