import { Component, inject } from "@angular/core";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [Button, InputComponent, RouterLink, ReactiveFormsModule],
    templateUrl: "./login.html",
    styleUrl: "./login.scss",
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Define login form with validations
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      // Logic for authentication would go here
      // For now, let's just navigate to home (or wherever)
      // this.router.navigate(['/']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

