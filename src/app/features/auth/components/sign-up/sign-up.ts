import { Component, inject } from "@angular/core";
import { Button } from "../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../shared/components/ui/input/input";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-sign-up",
    imports: [Button, InputComponent, RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: "./sign-up.html",
    styleUrl: "./sign-up.scss",
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  // Define signup form with core validations
  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    // Custom validator for password matching could be added here
    validators: (group: any) => {
      const pass = group.get('password')?.value;
      const confirmPass = group.get('confirmPassword')?.value;
      return pass === confirmPass ? null : { notMatched: true };
    }
  });

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup data:', this.signupForm.value);
      // Logic for registration
      this.router.navigate(['/login']);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}

