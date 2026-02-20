// src/domain/use-cases/referral/GetReferralDashboardUseCase.ts

import { ReferralDashboard } from '@/domain/entities/Referral.entity';

/**
 * Contrato do repositório (porta) para buscar o dashboard.
 * Implementação real fica em infrastructure/repositories.
 */
export interface IReferralRepository {
  getDashboard(): Promise<ReferralDashboard>;
}

export class GetReferralDashboardUseCase {
  constructor(private readonly referralRepository: IReferralRepository) {}

  async execute(): Promise<ReferralDashboard> {
    const dashboard = await this.referralRepository.getDashboard();

    // Segurança/robustez: falha explícita se backend retornar algo inesperado
    if (!dashboard || dashboard.success !== true) {
      throw new Error('Não foi possível carregar o dashboard de indicações');
    }

    return dashboard;
  }
}
