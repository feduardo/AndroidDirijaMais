// src/presentation/hooks/useReferral.ts

import { useCallback, useMemo, useState } from 'react';

import { ReferralDashboard, ReferralCampaignInfo } from '@/domain/entities/Referral.entity';
import { ApplyReferralCodeResponse } from '@/domain/entities/ReferralApply.entity';

import { GetReferralDashboardUseCase } from '@/domain/use-cases/referral/GetReferralDashboardUseCase';
import { GetReferralCampaignInfoUseCase } from '@/domain/use-cases/referral/GetReferralCampaignInfoUseCase';
import { ApplyReferralCodeUseCase } from '@/domain/use-cases/referral/ApplyReferralCodeUseCase';

import { ReferralRepository } from '@/infrastructure/repositories/ReferralRepository';
import { ReferralCampaignRepository } from '@/infrastructure/repositories/ReferralCampaignRepository';
import { ReferralApplyRepository } from '@/infrastructure/repositories/ReferralApplyRepository';

type ReferralState = {
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  campaign: ReferralCampaignInfo | null;
  dashboard: ReferralDashboard | null;
};

const normalizeErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Erro inesperado';
};

export const useReferral = () => {
  const [state, setState] = useState<ReferralState>({
    loading: false,
    refreshing: false,
    error: null,
    campaign: null,
    dashboard: null,
  });

  // DI simples (sem container), mantendo camadas separadas
  const useCases = useMemo(() => {
    const dashboardRepo = new ReferralRepository();
    const campaignRepo = new ReferralCampaignRepository();
    const applyRepo = new ReferralApplyRepository();

    return {
      getDashboard: new GetReferralDashboardUseCase(dashboardRepo),
      getCampaignInfo: new GetReferralCampaignInfoUseCase(campaignRepo),
      applyCode: new ApplyReferralCodeUseCase(applyRepo),
    };
  }, []);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [campaign, dashboard] = await Promise.all([
        useCases.getCampaignInfo.execute(),
        useCases.getDashboard.execute(),
      ]);

      setState((s) => ({
        ...s,
        loading: false,
        campaign,
        dashboard,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: normalizeErrorMessage(err),
      }));
    }
  }, [useCases]);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, refreshing: true, error: null }));
    try {
      const [campaign, dashboard] = await Promise.all([
        useCases.getCampaignInfo.execute(),
        useCases.getDashboard.execute(),
      ]);

      setState((s) => ({
        ...s,
        refreshing: false,
        campaign,
        dashboard,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        refreshing: false,
        error: normalizeErrorMessage(err),
      }));
    }
  }, [useCases]);

  const applyReferralCode = useCallback(
    async (code: string): Promise<ApplyReferralCodeResponse> => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await useCases.applyCode.execute(code);

        // Após aplicar, recarrega dashboard para refletir lista/estado atualizado
        const dashboard = await useCases.getDashboard.execute();

        setState((s) => ({
          ...s,
          loading: false,
          dashboard,
        }));

        return result;
      } catch (err) {
        const message = normalizeErrorMessage(err);
        setState((s) => ({ ...s, loading: false, error: message }));
        throw new Error(message);
      }
    },
    [useCases]
  );

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return {
    ...state,
    load,
    refresh,
    applyReferralCode,
    clearError,
  };
};
