import {Component, ChangeDetectionStrategy, input, output, inject, OnInit} from "@angular/core";
import {FormBuilder, Validators, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Button} from "../../../../shared/components/ui/button/button";
import {InputComponent} from "../../../../shared/components/ui/input/input";
import {AuthFlow} from "../../../../core/enums/auth-flow";

/**
 * Presentational component: email input step.
 * Shared across Sign Up (verify email) and Reset Password (forgot password) flows.
 */
@Component({
    selector: "app-send-email",
    imports: [InputComponent, Button, RouterLink, ReactiveFormsModule],
    templateUrl: "./send-email.html",
    styleUrl: "./send-email.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmail implements OnInit {
    /** Current auth flow (signup | reset) */
    flow = input.required<AuthFlow>();
    initialEmail = input<string>("");
    isLoading = input<boolean>(false);
    submitted = output<{email: string}>();

    protected readonly AuthFlow = AuthFlow;
    private readonly fb = inject(FormBuilder);

    emailForm = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
    });

    ngOnInit(): void {
        if (this.initialEmail()) {
            this.emailForm.patchValue({email: this.initialEmail()});
        }
    }

    /** Validate and emit email */
    onSubmit(): void {
        if (this.emailForm.valid) {
            this.submitted.emit({email: this.emailForm.getRawValue().email!});
        } else {
            this.emailForm.markAllAsTouched();
        }
    }
}
