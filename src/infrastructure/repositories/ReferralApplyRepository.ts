// src/infrastructure/repositories/ReferralApplyRepository.ts

import httpClient from '@/infrastructure/http/client';
import {
  ApplyReferralCodeRequest,
  IReferralApplyRepository,
} from '@/domain/use-cases/referral/ApplyReferralCodeUseCase';
import { ApplyReferralCodeResponse } from '@/domain/entities/ReferralApply.entity';

export class ReferralApplyRepository implements IReferralApplyRepository {
  /**
   * POST /api/v1/referral/apply-code
   * Requer Authorization via interceptor do httpClient.
   */
  async applyCode(
    payload: ApplyReferralCodeRequest
  ): Promise<ApplyReferralCodeResponse> {
    const { data } = await httpClient.post<ApplyReferralCodeResponse>(
      '/api/v1/referral/apply-code',
      payload
    );

    return data;
  }
}
