import httpClient from '@/infrastructure/http/client';
import { ReferralLedger } from '@/domain/entities/ReferralLedger.entity';
import {
  IReferralLedgerRepository,
} from '@/domain/use-cases/referral/GetReferralLedgerUseCase';

export class ReferralLedgerRepository
  implements IReferralLedgerRepository
{
  async getLedger(): Promise<ReferralLedger> {
    const { data } = await httpClient.get<ReferralLedger>(
      '/api/v1/referral/ledger'
    );

    return data;
  }
}
