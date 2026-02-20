// src/domain/use-cases/referral/GetReferralCampaignInfoUseCase.ts

import { ReferralCampaignInfo } from '@/domain/entities/Referral.entity';

/**
 * Contrato do repositório (porta) para buscar informações da campanha.
 * Implementação concreta fica na camada infrastructure.
 */
export interface IReferralCampaignRepository {
  getCampaignInfo(): Promise<ReferralCampaignInfo>;
}

export class GetReferralCampaignInfoUseCase {
  constructor(
    private readonly referralCampaignRepository: IReferralCampaignRepository
  ) {}

  async execute(): Promise<ReferralCampaignInfo> {
    const campaign = await this.referralCampaignRepository.getCampaignInfo();

    // Segurança defensiva: garante contrato mínimo
    if (!campaign || !campaign.id || !campaign.name) {
      throw new Error('Informações da campanha indisponíveis');
    }

    return campaign;
  }
}
