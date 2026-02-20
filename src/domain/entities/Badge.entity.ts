export type BadgeCode =
  | 'BADGE_DOCUMENTATION_COMPLETED'
  | 'BADGE_MEDICAL_COMPLETED'
  | 'BADGE_THEORETICAL_COMPLETED'
  | 'BADGE_PRACTICAL_COMPLETED'
  | 'BADGE_HABILITATION_COMPLETED'
  | 'BADGE_JOURNEY_COMPLETED';

export interface Badge {
  code: BadgeCode;
  granted_at: string;
}

export interface BadgesResponse {
  badges: Badge[];
}