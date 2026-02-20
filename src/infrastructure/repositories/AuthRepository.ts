import {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RegisterResponse
} from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User.entity';
import httpClient from '../http/client';
import SecureStorage from '../storage/SecureStorage';
import DeviceIdManager from '../storage/DeviceIdManager';
import { UnauthorizedError } from '../../shared/errors/AppError';
import { Platform } from 'react-native';

const DEVICE_TYPE = Platform.OS === 'ios' ? 'ios' : 
                   Platform.OS === 'android' ? 'android' : 
                   'web';

export class AuthRepository implements IAuthRepository {
  private readonly TOKEN_KEY = '@app:token';
  private readonly REFRESH_TOKEN_KEY = '@app:refresh_token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const deviceId = await DeviceIdManager.getDeviceId();
    
    const response = await httpClient.post('/api/v1/auth/login', {
      ...credentials,
      device_type: DEVICE_TYPE,
    }, {
      headers: {
        'X-Device-Id': deviceId,
      },
    });

    await this.saveTokens(
      response.data.access_token,
      response.data.refresh_token
    );

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
      user: response.data.user,
    };
  }

  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    const deviceId = await DeviceIdManager.getDeviceId();
    
    const response = await httpClient.post('/api/v1/auth/google', {
      id_token: idToken,
      device_type: DEVICE_TYPE,
    }, {
      headers: {
        'X-Device-Id': deviceId,
      },
    });

    await this.saveTokens(
      response.data.access_token,
      response.data.refresh_token
    );

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
      user: response.data.user,
    };
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await httpClient.post('/api/v1/auth/register', {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      cpf: data.cpf,
      role: data.role,
      device_type: DEVICE_TYPE,
    });

    return {
      message: response.data.message,
      email: response.data.email,
    };
  }

  async logout(): Promise<void> {
    await SecureStorage.removeItem(this.TOKEN_KEY);
    await SecureStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const response = await httpClient.post('/api/v1/auth/refresh', {
      refreshToken: token,
    });

    await this.saveTokens(
      response.data.access_token,
      response.data.refresh_token
    );

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
      user: response.data.user,
    };
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await SecureStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return null;
    }

    try {
      const response = await httpClient.get('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      throw new UnauthorizedError();
    }
  }

  private async saveTokens(token: string, refreshToken: string): Promise<void> {
    await SecureStorage.setItem(this.TOKEN_KEY, token);
    await SecureStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }
}