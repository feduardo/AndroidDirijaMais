export interface ReferralLedgerEntry {
  id: string;
  reward_type: string;
  milestone_count?: number | null;
  amount: string;
  status: 'pending' | 'confirmed' | 'reversed';
  created_at: string;
}

export interface ReferralLedger {
  success: boolean;
  balance: string;
  ledger: ReferralLedgerEntry[];
}
