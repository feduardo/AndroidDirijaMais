import httpClient from '../http/client';

export interface CreateWithdrawalMethodRequest {
  method_type: 'mercadopago' | 'other_bank';
  pix_key_type: 'cpf' | 'email' | 'phone' | 'random';
  pix_key: string;
  mp_email?: string;
  mp_user_id?: string;
}

export interface WithdrawalMethodResponse {
  id: string;
  user_id: string;
  method_type: 'mercadopago' | 'other_bank';
  pix_key_type: 'cpf' | 'email' | 'phone' | 'random';
  pix_key: string;
  mp_email?: string;
  mp_user_id?: string;
  status: 'pending' | 'validated' | 'rejected' | 'blocked';
  validated_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export class WithdrawalMethodRepository {
  /**
   * Criar ou atualizar método de saque
   */
  async createMethod(data: CreateWithdrawalMethodRequest): Promise<WithdrawalMethodResponse> {
    const response = await httpClient.post<WithdrawalMethodResponse>(
      '/api/v1/instructor/withdrawals/methods',
      data
    );
    return response.data;
  }

  /**
   * Buscar método de saque atual
   */
  async getCurrentMethod(): Promise<WithdrawalMethodResponse | null> {
    try {
      const response = await httpClient.get<WithdrawalMethodResponse>(
        '/api/v1/instructor/withdrawals/methods/current'
      );
      return response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }
}

export default new WithdrawalMethodRepository();