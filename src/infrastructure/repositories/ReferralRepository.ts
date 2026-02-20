// src/infrastructure/repositories/ReferralRepository.ts

import httpClient from '@/infrastructure/http/client';
import { ReferralDashboard } from '@/domain/entities/Referral.entity';
import { IReferralRepository } from '@/domain/use-cases/referral/GetReferralDashboardUseCase';

export class ReferralRepository implements IReferralRepository {
  /**
   * GET /api/v1/referral/dashboard
   * Token deve ser injetado via interceptor do httpClient.
   */
  async getDashboard(): Promise<ReferralDashboard> {
    const { data } = await httpClient.get<ReferralDashboard>(
      '/api/v1/referral/dashboard'
    );

    return data;
  }
}
