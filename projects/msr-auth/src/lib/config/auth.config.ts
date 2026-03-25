import { InjectionToken, ValueProvider } from '@angular/core';

export interface AuthEndpoints {
  login: string;
  register: string;
  forgotPassword: string;
  resetPassword: string;
  sendEmailVerification: string;
  confirmEmailVerification: string;
}

export interface AuthConfig {
  baseUrl: string;
  endpoints?: Partial<AuthEndpoints>;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('AUTH_CONFIG');

export const DEFAULT_ENDPOINTS: AuthEndpoints = {
  login: 'auth/login',
  register: 'auth/register',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password',
  sendEmailVerification: 'auth/send-email-verification',
  confirmEmailVerification: 'auth/confirm-email-verification',
};

/**
 * Configuration provider function for MsAuth library.
 * To be used in app.config.ts.
 *
 * @param authConfig The configuration object containing baseUrl and optional endpoint overrides.
 * @returns A ValueProvider for AUTH_CONFIG.
 */
export function provideMsrAuth(authConfig: AuthConfig): ValueProvider {
  return {
    provide: AUTH_CONFIG,
    useValue: {
      ...authConfig,
      endpoints: { ...DEFAULT_ENDPOINTS, ...authConfig.endpoints },
    },
  };
}
