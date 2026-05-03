import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy, DestroyRef } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Cards } from "../components/cards/cards";
import { DiplomasService } from "../../../core/services/diplomas/diplomas.service";
import { Diploma } from "../../../core/interfaces/diploma.interface";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Skeleton } from 'primeng/skeleton';
import { ObserveVisibilityDirective } from "../../../shared/directives/observe-visibility";


@Component({
  selector: "app-diplomas",
  imports: [Cards, CommonModule, NgOptimizedImage, Skeleton, ObserveVisibilityDirective],
  templateUrl: "./diplomas.html",
  styleUrl: "./diplomas.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Diplomas implements OnInit {
  private readonly diplomasService = inject(DiplomasService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  // Signals for state management
  diplomas = signal<Diploma[]>([]);
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);

  // Pagination/Display state
  readonly pageSize = 6;
  limit = signal<number>(this.pageSize);

  // Computed list for the UI
  displayedDiplomas = computed(() => (this.diplomas() || []).slice(0, this.limit()));
  hasMore = computed(() => this.limit() < (this.diplomas()?.length || 0));

  ngOnInit(): void {
    this.loadDiplomas();
  }

  /**
   * Fetches diplomas from the API
   */
  loadDiplomas(): void {
    this.isLoading.set(true);
    this.isError.set(false);
    this.diplomasService.getDiplomas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.diplomas.set(data);
          this.isLoading.set(false);
          this.isError.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.isError.set(true);
          this.diplomas.set([]);
        }
      });
  }

  /**
   * Increases the limit to show more items
   */
  loadMore(): void {
    if (this.hasMore()) {
      this.limit.update(prev => prev + this.pageSize);
    }
  }

  /**
   * Navigates to the exams page for a specific diploma
   * @param id Diploma ID
   */
  navigateToExams(id: string): void {
    this.router.navigate(['/dashboard/diplomas', id, 'exams']);
  }
}
