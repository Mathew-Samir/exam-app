import {Component, ChangeDetectionStrategy, output, inject, input} from "@angular/core";
import {FormBuilder, Validators, ReactiveFormsModule} from "@angular/forms";
import {Button} from "../../../../shared/components/ui/button/button";
import {InputComponent} from "../../../../shared/components/ui/input/input";
import {AuthFlow} from "../../../../core/enums/auth-flow";

/**
 * Presentational component: password creation step.
 * Shared across Sign Up (create password) and Reset Password (new password) flows.
 * Includes cross-field validation for password matching.
 */
@Component({
    selector: "app-create-new-password",
    imports: [Button, InputComponent, ReactiveFormsModule],
    templateUrl: "./create-new-password.html",
    styleUrl: "./create-new-password.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewPassword {
    /** Current auth flow (signup | reset) — determines button label */
    flow = input.required<AuthFlow>();
    isLoading = input<boolean>(false);
    submitted = output<{password: string; rePassword: string}>();

    protected readonly AuthFlow = AuthFlow;
    private readonly fb = inject(FormBuilder);

    /** Password form with cross-field mismatch validator */
    passwordForm = this.fb.group(
        {
            password: [
                "",
                [
                    Validators.required,
                    Validators.pattern(
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
                    ),
                ],
            ],
            rePassword: ["", [Validators.required]],
        },
        {
            validators: (group: any) => {
                const password = group.get("password")?.value;
                const confirm = group.get("rePassword")?.value;
                return password === confirm ? null : {mismatch: true};
            },
        }
    );

    /** Validate and emit passwords */
    onSubmit(): void {
        if (this.passwordForm.valid) {
            this.submitted.emit(this.passwordForm.getRawValue() as any);
        } else {
            this.passwordForm.markAllAsTouched();
        }
    }
}
