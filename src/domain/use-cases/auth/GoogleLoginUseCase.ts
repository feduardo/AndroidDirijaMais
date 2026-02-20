import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  IAuthRepository,
  AuthResponse,
} from '../../repositories/IAuthRepository';
import { AppError, ValidationError } from '../../../shared/errors/AppError';

export class GoogleLoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<AuthResponse> {
    try {
      // Verifica se Google Play Services está disponível
      await GoogleSignin.hasPlayServices();

      // Faz login com Google
      const userInfo = await GoogleSignin.signIn();

      // Valida resposta
      if (!userInfo.data?.idToken) {
        throw new ValidationError('Token do Google inválido');
      }

      // Envia idToken para backend validar e criar/buscar usuário
      // Backend deve verificar token com Google APIs
      const response = await this.authRepository.loginWithGoogle(
        userInfo.data.idToken
      );

      return response;
    } catch (error: any) {
      if (error.code === 'SIGN_IN_CANCELLED') {
        throw new AppError('Login cancelado pelo usuário', 400);
      }

      if (error.code === 'IN_PROGRESS') {
        throw new AppError('Login em andamento', 400);
      }

      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new AppError('Google Play Services não disponível', 503);
      }

      throw error;
    }
  }
}
