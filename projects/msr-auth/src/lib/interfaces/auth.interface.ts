/**
 * Standard API response wrapper.
 * @template TResponse The type of the data returned by the API.
 */
export interface AuthResponse<TResponse = unknown> {
  /** Success or failure status of the operation */
  status: boolean;
  /** HTTP or Application-specific status code */
  code: number;
  /** Descriptive message from the server */
  message: string;
  /** Optional response data payload */
  data?: TResponse;
}

/**
 * Standard error response structure for failed API requests.
 */
export interface ErrorResponse {
  /** Should always be false for errors */
  status: boolean;
  /** Error code */
  code: number;
  /** Error message */
  message: string;
  /** List of field-specific or general errors */
  errors: ApiError[];
}

export interface ApiError {
  path: string;
  message: string;
}

export interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Re-export Data as a generic or specific type if needed
export interface AuthData {
  token: string;
  code?: string;
  user: User;
}

// Request Interfaces
export interface LoginRequest {
  username?: string;
  password?: string;
  [key: string]: unknown; // Allow for custom fields safely
}

export interface RegisterRequest {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phone: string;
  [key: string]: unknown;
}

export interface ForgotPasswordRequest {
  email: string;
  [key: string]: unknown;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
  [key: string]: unknown;
}

export interface SendEmailVerificationRequest {
  email: string;
  [key: string]: unknown;
}

export interface ConfirmEmailVerificationRequest {
  email: string;
  code: string;
  [key: string]: unknown;
}
