import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from "@angular/core";
import {CommonModule} from "@angular/common";

/**
 * Presentational component: static success page shown after requesting a password reset.
 * Informs the user that a reset link was sent to their email.
 */
@Component({
    selector: "app-password-reset-sent",
    imports: [CommonModule],
    templateUrl: "./password-reset-sent.html",
    styleUrl: "./password-reset-sent.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetSent {
    @Input() email = "";
    @Output() back = new EventEmitter<void>();
    @Output() createAccount = new EventEmitter<void>();

    onBack() {
        this.back.emit();
    }

    onCreateAccount() {
        this.createAccount.emit();
    }
}
