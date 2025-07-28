export interface User {
  id: string;
  email: string;
  name:string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  profileStatus: ProfileStatus; // Nuevo campo
  verificationProgress?: number; // Progreso de verificación 0-100
}

export type UserRole = 'Administrador' | 'Usuario' | 'Taller' | 'SinRegistro';

export interface LoginCredentials {
  email: string;
  password: string;
  capchat:string;
  rememberMe?: boolean;
}
export interface VerifyCredentials {
  email: string;
  name: string;
  code:string;
}
export interface ResendCredentials {
  email: string;
  name: string;
}
export type ProfileStatus = 'logueado' | 'verificado' | 'visitante' | 'rechazado';

export interface RegisterData {
  name:string;
  email: string;
  password: string;
  capchat: string;
}

export interface AuthResponse {
  user: User;
  success: string;
  error?: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
export interface VerificationRequirement {
  requiresLogin?: boolean;
  requiresAuth?: boolean;
  requiredRoles?: UserRole[];
  feature?: string;
}

export interface AccessResult {
  hasAccess: boolean;
  reason?: 'not_logged' | 'not_verified' | 'insufficient_role';
  message?: string;
  actionText?: string;
  actionPath?: string;
}