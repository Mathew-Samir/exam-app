import {Component, Input, Output, EventEmitter, booleanAttribute} from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
    selector: "app-button",
    imports: [CommonModule],
    templateUrl: "./button.html",
    styleUrl: "./button.scss",
})
export class Button {
  @Input() label: string = 'Submit';
  @Input() type: 'button' | 'submit' = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) isLoading = false;
  @Input() loadingText?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (this.disabled || this.isLoading) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
