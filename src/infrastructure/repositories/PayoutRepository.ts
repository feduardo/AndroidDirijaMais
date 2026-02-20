import httpClient from '../http/client';

export interface BalanceResponse {
  available_balance: number;
  waiting_balance: number;
  total_available_payouts: number;
  total_waiting_payouts: number;
}

export interface PayoutCardResponse {
  id: string;
  booking_id: string;
  student_name: string;
  scheduled_date: string;
  gross_amount: number;
  net_amount: number;
  platform_fee: number;
  fee_percentage: number;
  is_anticipation: boolean;
  available_at: string;
  status: 'waiting' | 'available' | 'pending_transfer' | 'paid' | 'blocked';
}

export interface AnticipationResponse {
  payout_id: string;
  new_net_amount: number;
  new_fee_percentage: number;
  available_at: string;
}

export interface WithdrawalResponse {
  payout_id: string;
  amount: number;
  transfer_method: 'automatic' | 'manual';
  status: string;
}

export class PayoutRepository {
  /**
   * Buscar saldo disponível e aguardando
   */
  async getBalance(): Promise<BalanceResponse> {
    const response = await httpClient.get<BalanceResponse>(
      '/api/v1/instructor/payouts/balance'
    );
    return response.data;
  }

  /**
   * Listar payouts (aulas)
   */
  async listPayouts(status?: 'waiting' | 'available'): Promise<PayoutCardResponse[]> {
    const params = status ? { status } : {};
    const response = await httpClient.get<PayoutCardResponse[]>(
      '/api/v1/instructor/payouts/list',
      { params }
    );
    return response.data;
  }

  /**
   * Solicitar antecipação
   */
  async requestAnticipation(payoutId: string): Promise<AnticipationResponse> {
    const response = await httpClient.post<AnticipationResponse>(
      '/api/v1/instructor/payouts/anticipate',
      { payout_id: payoutId }
    );
    return response.data;
  }

  /**
   * Solicitar saque
   */
  async requestWithdrawal(payoutId: string): Promise<WithdrawalResponse> {
    const response = await httpClient.post<WithdrawalResponse>(
      '/api/v1/instructor/payouts/withdraw',
      { payout_id: payoutId }
    );
    return response.data;
  }
}

export default new PayoutRepository();