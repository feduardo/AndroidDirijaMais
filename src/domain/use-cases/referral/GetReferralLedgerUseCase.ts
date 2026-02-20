import { ReferralLedger } from '@/domain/entities/ReferralLedger.entity';

export interface IReferralLedgerRepository {
  getLedger(): Promise<ReferralLedger>;
}

export class GetReferralLedgerUseCase {
  constructor(
    private readonly referralLedgerRepository: IReferralLedgerRepository
  ) {}

  async execute(): Promise<ReferralLedger> {
    const ledger = await this.referralLedgerRepository.getLedger();

    if (!ledger || ledger.success !== true) {
      throw new Error('Não foi possível carregar o extrato');
    }

    return ledger;
  }
}
