import { useState } from 'react';
import { useAuthStore } from '../state/authStore';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { LoginUseCase } from '../../domain/use-cases/auth/LoginUseCase';
import { GoogleLoginUseCase } from '../../domain/use-cases/auth/GoogleLoginUseCase';
import { RegisterUseCase } from '../../domain/use-cases/auth/RegisterUseCase';
import { LoginCredentials } from '../../domain/repositories/IAuthRepository';
import { RegisterFormData } from '../../domain/entities/RegisterData.entity';

const authRepository = new AuthRepository();

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    user,
    isAuthenticated,
    setUser,
    setToken,
    logout: clearAuth,
  } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const loginUseCase = new LoginUseCase(authRepository);
      const response = await loginUseCase.execute(credentials);
      
      // Usa o método login que salva no storage
      const { login: saveAuth } = useAuthStore.getState();
      await saveAuth(response.user, response.token, response.refreshToken);
      
      return response;
    } catch (err: any) {
      if (err?.isSessionExpired) {
        setError(err.message); // "Faça login para continuar"
      } else {
        setError(err.message || 'Erro ao fazer login');
      }
      throw err;
    }

  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const googleLoginUseCase = new GoogleLoginUseCase(authRepository);
      const response = await googleLoginUseCase.execute();
      setUser(response.user);
      setToken(response.token);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
      throw err;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setError(null);
      const registerUseCase = new RegisterUseCase(authRepository);
      const response = await registerUseCase.execute(data);
      
      return response;
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer cadastro');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authRepository.logout();
      clearAuth();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout');
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
  };
};
