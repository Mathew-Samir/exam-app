import { Component, inject, OnInit, signal, DestroyRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { DiplomasService } from "../../../core/services/diplomas/diplomas.service";
import { Diploma } from "../../../core/interfaces/diploma.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { Skeleton } from 'primeng/skeleton';
import { RowExam } from "./components/row-exam/row-exam";

@Component({
  selector: "app-exams",
  imports: [CommonModule, RowExam, Skeleton],
  templateUrl: "./exams.html",
  styleUrl: "./exams.scss",
})
export class Exams implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly diplomasService = inject(DiplomasService);
  private readonly destroyRef = inject(DestroyRef);

  diploma = signal<Diploma | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = params.get('diplomaId');
      if (id) {
        this.loadDiplomaDetails(id);
      }
    });
  }

  loadDiplomaDetails(id: string): void {
    this.isLoading.set(true);
    this.diplomasService.getDiplomaById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.diploma.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}
