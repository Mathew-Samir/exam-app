import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_CONFIG } from '../config/auth.config';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SendEmailVerificationRequest,
  ConfirmEmailVerificationRequest,
  AuthData,
} from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class MsrAuth {
  private httpClient = inject(HttpClient);
  private authConfig = inject(AUTH_CONFIG);

  private get baseUrl() {
    return this.authConfig.baseUrl;
  }

  private get endpoints() {
    return this.authConfig.endpoints!;
  }

  /**
   * Authenticate a user with username and password.
   * @param payload The login credentials.
   * @returns Observable with the authentication response (token, user details).
   */
  login<TResponse = AuthData, TRequest = LoginRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.login}`, payload);
  }

  /**
   * Register a new user account.
   * @param payload The user registration data.
   * @returns Observable with the registration success response.
   */
  register<TResponse = unknown, TRequest = RegisterRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.register}`, payload);
  }

  /**
   * Initiates the password recovery process for a given email address.
   * @param payload Object containing the email of the account to recover.
   * @returns Observable indicating progress of the forgot password request.
   */
  forgotPassword<TResponse = unknown, TRequest = ForgotPasswordRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.forgotPassword}`, payload);
  }

  /**
   * Resets the user's password using a verification token.
   * @param payload The reset token and new password data.
   * @returns Observable of the reset password status.
   */
  resetPassword<TResponse = unknown, TRequest = ResetPasswordRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.resetPassword}`, payload);
  }

  /**
   * Sends a verification email to the user for email validation.
   * @param payload Object containing the email to verify.
   * @returns Observable of the email sending status.
   */
  sendEmailVerification<TResponse = unknown, TRequest = SendEmailVerificationRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.sendEmailVerification}`, payload);
  }

  /**
   * Confirms the email verification using a code.
   * @param payload The email and the verification code sent.
   * @returns Observable of the confirmation status.
   */
  confirmEmailVerification<TResponse = unknown, TRequest = ConfirmEmailVerificationRequest>(payload: TRequest): Observable<AuthResponse<TResponse>> {
    return this.httpClient.post<AuthResponse<TResponse>>(`${this.baseUrl}/${this.endpoints.confirmEmailVerification}`, payload);
  }
}
