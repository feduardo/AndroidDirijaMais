import axios from 'axios';
import ENV from '../../core/config/env';
import SecureStorage from '../storage/SecureStorage';
import { UserRole } from '../../domain/entities/User.entity';
import DeviceIdManager from '../storage/DeviceIdManager';
import { Platform } from 'react-native';
import { forceLogout } from '../auth/authEvents';




const DEVICE_TYPE = Platform.OS === 'ios' ? 'ios' : 
                   Platform.OS === 'android' ? 'android' : 
                   'web';


const httpClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== MOCK INTERCEPTOR (REMOVER QUANDO BACKEND ESTIVER PRONTO) ==========
const MOCK_ENABLED = false; // Alterar para false quando backend estiver pronto

if (MOCK_ENABLED) {
  httpClient.interceptors.request.use(async config => {
    // Mock: POST /auth/register
    if (config.url === '/auth/register' && config.method === 'post') {
      const { email, cpf, name, phone } = config.data;

      return {
        ...config,
        adapter: async () => {
          await new Promise(resolve =>
            setTimeout(() => resolve(undefined), 2000)
          );

          // Simula email já existente
          if (email === 'existente@test.com') {
            throw {
              response: {
                status: 400,
                data: { message: 'Email já cadastrado' },
              },
            };
          }

          // Simula CPF já existente
          if (cpf === '11111111111') {
            throw {
              response: {
                status: 400,
                data: { message: 'CPF já cadastrado' },
              },
            };
          }

          // Sucesso
          return {
            data: {
              user: {
                id: Math.random().toString(36).substr(2, 9),
                name,
                email,
                phone,
                cpf,
                role: UserRole.STUDENT,
              },
              token: `mock-jwt-token-${Date.now()}`,
              refreshToken: `mock-refresh-token-${Date.now()}`,
            },
            status: 201,
            statusText: 'Created',
            headers: {},
            config,
          };
        },
      };
    }

    // Mock: POST /auth/login
    if (config.url === '/auth/login' && config.method === 'post') {
      const { email, password } = config.data;

      return {
        ...config,
        adapter: async () => {
          await new Promise(resolve =>
            setTimeout(() => resolve(undefined), 1500)
          );

          if (email === 'test@test.com' && password === '123456') {
            return {
              data: {
                user: {
                  id: '1',
                  name: 'Usuário Teste',
                  email,
                  phone: '31999999999',
                  cpf: '12345678900',
                  role: UserRole.STUDENT, //STUDENT INSTRUCTOR
                },
                token: 'mock-jwt-token-12345',
                refreshToken: 'mock-refresh-token-12345',
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config,
            };
          }

          throw {
            response: {
              status: 401,
              data: { message: 'Credenciais inválidas' },
            },
          };
        },
      };
    }

    return config;
  });
}
// ========== FIM DO MOCK ==========


// Request interceptor - adiciona token e device_id
httpClient.interceptors.request.use(
  async config => {
    // Normalizar headers (pode vir undefined)
    config.headers = config.headers ?? {};

    // Adicionar token
    const token = await SecureStorage.getItem('@app:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar device_id em TODOS os requests autenticados
    if (token) {
      try {
        const deviceId = await DeviceIdManager.getDeviceId();
        config.headers['X-Device-Id'] = deviceId;
      } catch (error) {
        // Falha silenciosa - request continua sem device_id
        console.warn('Failed to get device_id:', error);
      }
    }

    if (ENV.ENABLE_LOGS) {
      // NUNCA logar headers sensíveis (token, device_id)
      console.log('REQUEST:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - trata erros e refresh token
httpClient.interceptors.response.use(
  response => {
    if (ENV.ENABLE_LOGS) {
      console.log('RESPONSE:', response.status, response.config.url);
    }
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Se 401 e não é retry, tenta refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStorage.getItem('@app:refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${ENV.API_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
            device_type: DEVICE_TYPE,
          });

          const { access_token } = response.data;
          await SecureStorage.setItem('@app:token', access_token);
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        await forceLogout();

        return Promise.reject({
          isSessionExpired: true,
          message: 'Faça login para continuar',
        });
      }
    } // Missing closing brace for the if statement

    if (ENV.ENABLE_LOGS) {
      console.error('ERROR:', error.response?.status, error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default httpClient;