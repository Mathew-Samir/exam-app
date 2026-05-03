import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

/** User profile data returned from the API */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/** Standard API response wrapping a user profile */
export interface ProfileResponse {
  status: boolean;
  code: number;
  payload: {
    user: UserProfile;
  };
}

/** Payload for updating user profile */
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  phone: string;
}

/** Payload for changing user password */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/** Generic API response with a message */
export interface ApiMessageResponse {
  status: boolean;
  code: number;
  message: string;
}

/**
 * ProfileService
 * Handles all user profile-related API operations including
 * fetching, updating, password changes, email changes, and account deletion.
 */
@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = "https://exam-app.elevate-bootcamp.cloud/api/users";

  /**
   * Fetch the current user's profile
   * @returns Observable of ProfileResponse
   */
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.baseUrl}/profile`);
  }

  /**
   * Update the current user's profile
   * @param payload - Updated profile fields
   * @returns Observable of ApiMessageResponse
   */
  updateProfile(payload: UpdateProfileRequest): Observable<ApiMessageResponse> {
    return this.http.patch<ApiMessageResponse>(`${this.baseUrl}/profile`, payload);
  }

  /**
   * Change the current user's password
   * @param payload - Current and new password data
   * @returns Observable of ApiMessageResponse
   */
  changePassword(payload: ChangePasswordRequest): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.baseUrl}/change-password`, payload);
  }

  /**
   * Request an email change by sending a verification code
   * @param newEmail - The new email address
   * @returns Observable of ApiMessageResponse
   */
  requestEmailChange(newEmail: string): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.baseUrl}/email/request`, { newEmail });
  }

  /**
   * Confirm email change with a verification code
   * @param code - Verification code from email
   * @returns Observable of ProfileResponse
   */
  confirmEmailChange(code: string): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.baseUrl}/email/confirm`, { code });
  }

  /**
   * Delete the current user's account permanently
   * @returns Observable of ApiMessageResponse
   */
  deleteAccount(): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(`${this.baseUrl}/account`);
  }
}
