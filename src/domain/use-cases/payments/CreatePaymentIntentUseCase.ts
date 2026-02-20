import { PaymentRepository } from '../../../infrastructure/repositories/PaymentRepository';

export class CreatePaymentIntentUseCase {
  constructor(private repo: PaymentRepository) {}

  execute(bookingId: string) {
    return this.repo.createIntent(bookingId);
  }
}
