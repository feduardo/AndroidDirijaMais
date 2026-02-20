// src/domain/entities/ReferralApply.entity.ts

/**
 * Resposta do backend ao aplicar código de indicação
 * POST /api/v1/referral/apply-code
 */
export interface ApplyReferralCodeResponse {
  success: boolean;
  message: string;

  discount_percent: number;
  discount_max_amount: number;

  referrer_name: string;
}
