import { User } from '../entities/User.entity';

export interface LoginCredentials {
  email: string;
  password: string;
  device_type?: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  role: 'student' | 'instructor';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// NOVO: Resposta de registro (sem tokens)
export interface RegisterResponse {
  message: string;
  email: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  loginWithGoogle(idToken: string): Promise<AuthResponse>;
  register(data: RegisterData): Promise<RegisterResponse>; // MUDANÇA AQUI
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthResponse>;
  getCurrentUser(): Promise<User | null>;
}