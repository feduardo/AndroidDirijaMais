// src/domain/use-cases/referral/ApplyReferralCodeUseCase.ts

import { ApplyReferralCodeResponse } from '@/domain/entities/ReferralApply.entity';

/**
 * Payload do apply-code (contrato do backend)
 */
export interface ApplyReferralCodeRequest {
  code: string;
}

/**
 * Contrato do repositório (porta) para aplicar código.
 */
export interface IReferralApplyRepository {
  applyCode(payload: ApplyReferralCodeRequest): Promise<ApplyReferralCodeResponse>;
}

export class ApplyReferralCodeUseCase {
  constructor(private readonly referralApplyRepository: IReferralApplyRepository) {}

  async execute(codeRaw: string): Promise<ApplyReferralCodeResponse> {
    const code = codeRaw.trim().toUpperCase();

    if (!code) throw new Error('Digite um código');
    if (code.length < 4 || code.length > 20) {
      throw new Error('Código deve ter entre 4 e 20 caracteres');
    }
    if (!/^[A-Z0-9]+$/.test(code)) {
      throw new Error('Use apenas letras e números');
    }

    return this.referralApplyRepository.applyCode({ code });
  }
}
