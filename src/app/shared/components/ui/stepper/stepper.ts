import { Component, input, computed, ChangeDetectionStrategy } from "@angular/core";

/**
 * Shared diamond-style stepper indicator.
 * Renders a horizontal row of diamond markers with connecting lines.
 * Accepts 0-indexed activeStep and total number of steps.
 */
@Component({
  selector: "app-stepper",
  imports: [],
  templateUrl: "./stepper.html",
  styleUrl: "./stepper.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stepper {
  /** Current active step (0-indexed) */
  activeStep = input.required<number>();
  /** Total number of steps in the flow */
  totalSteps = input.required<number>();

  /** Generate step indices array */
  steps = computed(() => Array.from({ length: this.totalSteps() }, (_, i) => i));
}
