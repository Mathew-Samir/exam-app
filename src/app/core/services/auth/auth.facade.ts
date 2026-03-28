import {inject, Injectable, signal} from "@angular/core";
import {
    MsrAuth,
    AuthResponse,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SendEmailVerificationRequest,
    ConfirmEmailVerificationRequest,
    AuthData,
} from "msr-auth";
import {Observable, tap, catchError, of, finalize} from "rxjs";

@Injectable({
    providedIn: "root",
})
export class AuthFacade {
    private readonly msrAuth = inject(MsrAuth);

    // Signals for state tracking
    readonly loading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly userEmail = signal<string | null>(null); // To store email across signup steps

    /**
     * Send email verification code
     */
    sendEmailVerification(payload: SendEmailVerificationRequest): Observable<AuthResponse> {
        this.setLoading(true);
        return this.msrAuth.sendEmailVerification(payload).pipe(
            tap((res) => {
                if (res.status) {
                    this.userEmail.set(payload.email);
                    this.error.set(null);
                }
            }),
            catchError(this.handleError.bind(this)),
            finalize(() => this.setLoading(false))
        );
    }

    /**
     * Confirm email verification code
     */
    confirmEmailVerification(payload: ConfirmEmailVerificationRequest): Observable<AuthResponse> {
        this.setLoading(true);
        return this.msrAuth.confirmEmailVerification(payload).pipe(
            tap((res) => {
                if (res.status) {
                    this.error.set(null);
                }
            }),
            catchError(this.handleError.bind(this)),
            finalize(() => this.setLoading(false))
        );
    }

    /**
     * Register a new user
     */
    register(payload: RegisterRequest): Observable<AuthResponse> {
        this.setLoading(true);
        return this.msrAuth.register(payload).pipe(
            tap((res) => {
                if (res.status) {
                    this.error.set(null);
                }
            }),
            catchError(this.handleError.bind(this)),
            finalize(() => this.setLoading(false))
        );
    }

    /**
     * Forgot password request
     */
    forgotPassword(payload: ForgotPasswordRequest): Observable<AuthResponse> {
        this.setLoading(true);
        return this.msrAuth.forgotPassword(payload).pipe(
            tap((res) => {
                if (res.status) {
                    this.userEmail.set(payload.email);
                    this.error.set(null);
                }
            }),
            catchError(this.handleError.bind(this)),
            finalize(() => this.setLoading(false))
        );
    }

    /**
     * Reset password with token
     */
    resetPassword(payload: ResetPasswordRequest): Observable<AuthResponse> {
        this.setLoading(true);
        return this.msrAuth.resetPassword(payload).pipe(
            tap((res) => {
                if (res.status) {
                    this.error.set(null);
                }
            }),
            catchError(this.handleError.bind(this)),
            finalize(() => this.setLoading(false))
        );
    }

    private setLoading(value: boolean): void {
        this.loading.set(value);
    }

    private handleError(error: any): Observable<never> {
        const message = error.error?.message || error.message || "An unexpected error occurred";
        this.error.set(message);
        throw error;
    }
}
