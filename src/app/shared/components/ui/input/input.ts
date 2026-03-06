import {Component, EventEmitter,Input, Output, Optional, Self, booleanAttribute} from '@angular/core';
import { ControlValueAccessor,  NgControl} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: "app-input",
    imports: [CommonModule],
    templateUrl: "./input.html",
    styleUrl: "./input.scss",
})
export class InputComponent implements ControlValueAccessor {

    // ===== Basic =====
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input({transform: booleanAttribute}) required = false;
  @Input({transform: booleanAttribute}) disabled = false;

  // ===== UI =====
  @Input({transform: booleanAttribute}) showPasswordToggle = true;

  @Output() blur = new EventEmitter<void>();

  value = '';
  showPassword = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ===== Helpers =====

  get control() {
    return this.ngControl?.control;
  }

  get hasError(): boolean {
    return !!(this.control?.invalid && this.control?.touched);
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';

    if (this.control.errors['required'])
      return `${this.label || 'This field'} is required`;

    if (this.control.errors['email'])
      return 'Invalid email address';

    if (this.control.errors['minlength'])
      return `Minimum ${this.control.errors['minlength'].requiredLength} characters required`;

    if (this.control.errors['pattern'])
      return 'Invalid format';

    return 'Invalid value';
  }


  get inputType(): string {
    if (this.type === 'password' && this.showPasswordToggle && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  // ===== Events =====

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur() {
    this.onTouched();
    this.blur.emit();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // ===== CVA =====

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
