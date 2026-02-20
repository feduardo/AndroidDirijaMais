export interface InstructorAvailability {
  id: string;
  instructor_id: string;
  day_of_week: number; // 0=dom, 1=seg, ..., 6=sáb
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAvailabilityPayload {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface InstructorBlock {
  id: string;
  instructor_id: string;
  block_date: string; // "YYYY-MM-DD"
  start_time: string | null; // "HH:MM:SS" ou null (dia inteiro)
  end_time: string | null; // "HH:MM:SS" ou null (dia inteiro)
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlockPayload {
  block_date: string;
  start_time?: string;
  end_time?: string;
  reason: string;
}

export const BLOCK_REASONS = [
  'Agenda Fechada',
  'Manutenção do veículo',
  'Férias',
  'Outros',
] as const;

export type BlockReason = typeof BLOCK_REASONS[number];