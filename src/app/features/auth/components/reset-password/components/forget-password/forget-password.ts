import { Component, inject, output } from "@angular/core";
import { Button } from "../../../../../../shared/components/ui/button/button";
import { InputComponent } from "../../../../../../shared/components/ui/input/input";
import { RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";


@Component({
    selector: "app-forget-password",
    standalone: true,
    imports: [Button, InputComponent, RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: "./forget-password.html",
    styleUrl: "./forget-password.scss",
})
export class ForgetPassword {
    private readonly fb = inject(FormBuilder);
    next = output<void>();

    forgetForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });


    onSubmit() {
        if (this.forgetForm.valid) {
            console.log('Forget password email:', this.forgetForm.value.email);
            // Logic to send OTP would go here
            this.next.emit();
        } else {
            this.forgetForm.markAllAsTouched();
        }
    }
}


