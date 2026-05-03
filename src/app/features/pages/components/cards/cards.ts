import { Component, input, signal, HostListener, ElementRef, inject } from "@angular/core";
import { NgOptimizedImage, CommonModule } from "@angular/common";

@Component({
  selector: "app-cards",
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: "./cards.html",
  styleUrl: "./cards.scss",
})
export class Cards {
  private elementRef = inject(ElementRef);

  // Inputs for dynamic data
  title = input<string>('');
  description = input<string>('');
  imageUrl = input<string>('');

  // State for expanding description
  isExpanded = signal<boolean>(false);

  /**
   * Toggles the expanded state of the description
   */
  toggleDescription(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isExpanded.update(val => !val);
  }

  /**
   * Closes the description if a click occurs outside the card
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isExpanded.set(false);
    }
  }
}
