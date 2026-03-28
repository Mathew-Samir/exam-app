import { Component, ChangeDetectionStrategy, output, inject, input } from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { PhoneInputComponent } from "../../../../shared/components/ui/phone-input/phone-input";

/**
 * Presentational component: account info form (first name, last name, username, phone).
 * Used only in the Sign Up flow.
 */
@Component({
  selector: "app-create-account",
  imports: [Button, InputComponent, PhoneInputComponent, ReactiveFormsModule],
  templateUrl: "./create-account.html",
  styleUrl: "./create-account.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccount {
  isLoading = input<boolean>(false);
  submitted = output<{ firstName: string; lastName: string; username: string; phone: string }>();

  private readonly fb = inject(FormBuilder);

  accountForm = this.fb.group({
    firstName: ["", [Validators.required, Validators.minLength(2)]],
    lastName: ["", [Validators.required, Validators.minLength(2)]],
    username: ["", [Validators.required, Validators.minLength(3)]],
    phone: ["", [Validators.required]],
  });

  /** Validate and emit account data */
  onSubmit(): void {
    if (this.accountForm.valid) {
      this.submitted.emit(this.accountForm.getRawValue() as any);
    } else {
      this.accountForm.markAllAsTouched();
    }
  }
}
