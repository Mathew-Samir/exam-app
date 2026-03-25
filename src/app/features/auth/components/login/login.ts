import { Component, DestroyRef, inject } from "@angular/core";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MsrAuth } from 'msr-auth';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-login",
    imports: [Button, InputComponent, RouterLink, ReactiveFormsModule],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly msAuthService = inject(MsrAuth);
  private readonly destroyRef = inject(DestroyRef);

  // Define login form with validations
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.msAuthService.login({
        username: email!,
        password: password!
      }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          if (response.status) {
            this.router.navigate(['/']);
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

