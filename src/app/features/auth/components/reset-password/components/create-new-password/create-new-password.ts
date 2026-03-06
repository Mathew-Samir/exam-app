import { Component, inject } from "@angular/core";
import { InputComponent } from "../../../../../../shared/components/ui/input/input";
import { Button } from "../../../../../../shared/components/ui/button/button";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-create-new-password",
    standalone: true,
    imports: [InputComponent, Button, RouterLink, ReactiveFormsModule, CommonModule],
    templateUrl: "./create-new-password.html",
    styleUrl: "./create-new-password.scss",
})
export class CreateNewPassword {

    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    resetForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    }, {
        validators: (group: any) => {
            const pass = group.get('password')?.value;
            const confirmPass = group.get('confirmPassword')?.value;
            return pass === confirmPass ? null : { notMatched: true };
        }
    });

    onSubmit() {
        if (this.resetForm.valid) {
            console.log('Password reset successfully');
            this.router.navigate(['/login']);
        } else {
            this.resetForm.markAllAsTouched();
        }
    }
}


