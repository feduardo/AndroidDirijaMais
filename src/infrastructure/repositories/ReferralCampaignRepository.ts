// src/infrastructure/repositories/ReferralCampaignRepository.ts

import httpClient from '@/infrastructure/http/client';
import { ReferralCampaignInfo } from '@/domain/entities/Referral.entity';
import {
  IReferralCampaignRepository,
} from '@/domain/use-cases/referral/GetReferralCampaignInfoUseCase';

export class ReferralCampaignRepository
  implements IReferralCampaignRepository
{
  /**
   * GET /api/v1/referral/campaign-info
   * Público (não requer token).
   */
  async getCampaignInfo(): Promise<ReferralCampaignInfo> {
    const { data } = await httpClient.get<ReferralCampaignInfo>(
      '/api/v1/referral/campaign-info'
    );

    return data;
  }
}
