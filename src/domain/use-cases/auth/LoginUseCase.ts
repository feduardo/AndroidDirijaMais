import {
  IAuthRepository,
  LoginCredentials,
  AuthResponse,
} from '../../repositories/IAuthRepository';
import { ValidationError } from '../../../shared/errors/AppError';
import { useAuthStore } from '../../../presentation/state/authStore';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    this.validate(credentials);

    try {
      const response = await this.authRepository.login(credentials);

      // Salvar no authStore com persistência
      await useAuthStore.getState().login(
        response.user,
        response.token,
        response.refreshToken
      );

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  private validate(credentials: LoginCredentials): void {
    if (!credentials.email || !credentials.email.includes('@')) {
      throw new ValidationError('Email inválido');
    }

    if (!credentials.password || credentials.password.length < 6) {
      throw new ValidationError('Senha deve ter no mínimo 6 caracteres');
    }
  }
}