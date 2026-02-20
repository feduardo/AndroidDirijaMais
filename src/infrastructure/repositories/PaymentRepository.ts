import httpClient from '../http/client';

export interface CreatePaymentIntentResponse {
  payment_id: string;
  checkout_url: string;      // ← NOVO (Mercado Pago)
  preference_id: string;      // ← NOVO (Mercado Pago)
  amount: number;
  currency: string;
  provider: string;           // ← NOVO
}

export class PaymentRepository {
  async createIntent(bookingId: string): Promise<CreatePaymentIntentResponse> {
    const { data } = await httpClient.post('/api/v1/payments/create-intent', {
      booking_id: bookingId,
    });
    return data;
  }
}