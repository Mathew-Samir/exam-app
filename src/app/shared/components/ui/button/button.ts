import { Component, Input, Output, EventEmitter, booleanAttribute, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Shared reusable button component.
 * Supports loading state, disabled state, and optional leading/trailing icons.
 */
@Component({
  selector: "app-button",
  imports: [CommonModule],
  templateUrl: "./button.html",
  styleUrl: "./button.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  // -- Content --
  @Input() label = "Submit";
  @Input() type: "button" | "submit" = "button";
  @Input() icon?: string;
  @Input() iconPos: "left" | "right" = "right";

  // -- State --
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) isLoading = false;
  @Input() loadingText?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  /** Prevent interaction when disabled or loading */
  onClick(event: MouseEvent) {
    if (this.disabled || this.isLoading) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
