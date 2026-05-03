import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appObserveVisibility]',
  standalone: true
})
export class ObserveVisibilityDirective implements OnInit, OnDestroy {
  @Output() visible = new EventEmitter<void>();

  private observer?: IntersectionObserver;
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.visible.emit();
        }
      }, {
        threshold: 0,
        rootMargin: '150px'
      });
      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
