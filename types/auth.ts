export interface User {
  id: number
  name: string
  email: string
  is_verified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  captchaToken: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  captchaToken: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface VerifyEmailRequest {
  name:string
  email: string
  code: string
}