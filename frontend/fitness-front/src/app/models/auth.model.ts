// ============================================================================
// AUTHENTICATION MODELS - Backend DTO'lar ile uyumlu
// ============================================================================

// User Role Enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

// ============================================================================
// REQUEST MODELS (Frontend -> Backend)
// ============================================================================

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// ============================================================================
// RESPONSE MODELS (Backend -> Frontend)
// ============================================================================

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  role: UserRole;
  verified: boolean;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: UserInfo;
  message: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  verificationEmailSent: boolean;
}

export interface VerificationResponse {
  message: string;
  success: boolean;
  email?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ============================================================================
// FRONTEND-SPECIFIC MODELS
// ============================================================================

// Authentication State (Angular Service için)
export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Local Storage Keys
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'fitness_auth_token',
  USER: 'fitness_auth_user',
  REMEMBER_ME: 'fitness_remember_me'
} as const;

// Form Validation Rules
export const AUTH_VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
} as const;

// HTTP Status Codes (Auth için)
export const AUTH_HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  UNPROCESSABLE_ENTITY: 422
} as const; 