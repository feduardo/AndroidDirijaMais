// Domínio: Referral (Indique e Ganhe)
// Fonte da verdade: payloads reais do backend (/campaign-info, /dashboard)

/**
 * Informações públicas da campanha ativa
 * GET /api/v1/referral/campaign-info
 */
export interface ReferralCampaignInfo {
  id: string;
  name: string;
  description: string | null;

  new_user_discount_percent: number;
  new_user_discount_max_amount: number;

  milestones: ReferralMilestone[];
}

/**
 * Milestone definido no rules_json da campanha
 */
export interface ReferralMilestone {
  count: number;          // ex: 10, 25, 50, 100
  reward_amount: number;  // ex: 10.0, 30.0
}

/**
 * Próximo milestone calculado pelo backend
 * Campo opcional no dashboard
 */
export interface ReferralNextMilestone {
  count: number;          // milestone alvo
  reward_amount: number;  // valor da recompensa
  progress: number;       // quantos válidos já tem
  remaining: number;      // quantos faltam
}

/**
 * Item de indicação individual (lista do dashboard)
 */
export interface ReferralItem {
  referred_email: string;        // email mascarado (ex: c***@gmail.com)
  applied_at: string;            // ISO datetime
  has_completed_lesson: boolean; // true quando lesson_completed_valid existe
}

/**
 * Dashboard do indicador
 * GET /api/v1/referral/dashboard
 */
export interface ReferralDashboard {
  success: boolean;

  code: string;                  // código do usuário
  total_referrals: number;       // total aplicados
  valid_referrals: number;       // com 1ª aula concluída
  balance: number;               // saldo atual (confirmed)

  next_milestone?: ReferralNextMilestone | null;

  referrals: ReferralItem[];

  campaign_name: string;
}
