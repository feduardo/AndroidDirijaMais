/**
 * Tipos da API - Contrato Backend ↔ Frontend
 * Fonte única de verdade (OpenAPI)
 */

/* =========================
 * BOOKING
 * ========================= */

// Status do booking (ENUM do backend)
export enum BookingStatus {
  // Status do backend
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED_STUDENT = 'cancelled_student',
  CANCELLED_INSTRUCTOR = 'cancelled_instructor',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  NO_SHOW = 'no_show',

  // Status de UI (front-end only)
  AWAITING_STUDENT_CONFIRMATION = 'awaiting_student_confirmation',
}

/**
 * Novos campos do backend (GET /api/v1/instructor/bookings)
 */
export type PaymentStatus = 'succeeded' | 'processing' | 'refunded' | 'failed' | null;
export type PaymentMethod = 'credit_card' | 'pix' | 'boleto' | null;

// Request: Criar booking
export interface BookingCreateRequest {
  instructor_id: string; // UUID
  scheduled_date: string; // ISO UTC (ex: "2025-01-10T18:00:00Z")
  duration_minutes: number; // Ex: 50, 100, 150, 200
}

// Response: Booking completo
export interface BookingAPIResponse {
  id: string; // UUID
  student_id: string;
  student_name: string;
  student_avatar?: string;
  instructor_id: string;
  instructor_name: string;
  instructor_avatar: string;
  scheduled_date: string; // ISO UTC
  duration_minutes: number;
  location?: string;
  notes?: string;
  status: BookingStatus;
  price_per_hour: number;
  total_price: number;

  start_code: string;
  start_code_used: boolean;
  
  /**
   * NOVOS CAMPOS
   */
  payment_status: PaymentStatus; // "succeeded" | "processing" | "failed" | null
  payment_method: PaymentMethod; // "credit_card" | "pix" | "boleto" | null
  can_accept: boolean; // true = pagamento confirmado, pode aceitar

  created_at: string; // ISO UTC
  updated_at: string; // ISO UTC
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  can_cancel?: boolean;
  confirmed_at?: string | null;
  finished_at?: string | null;
}

/* =========================
 * INSTRUTOR — DASHBOARD
 * ========================= */

export interface InstructorDashboardResponse {
  today_classes: number;
  total_bookings: number;
  pending: number;
  accepted: number;
  in_progress: number;
  completed: number;
}

/* =========================
 * INSTRUTOR — AGENDA (GERENCIAL)
 * ⚠️ NÃO USAR PARA O ALUNO
 * ========================= */

// Disponibilidade semanal (uso interno / instrutor)
export interface AvailabilityRule {
  weekday: number; // 0-6 (domingo a sábado)
  start_time: string; // "08:00:00"
  end_time: string; // "12:00:00"
}

// Bloqueio pontual (uso interno / instrutor)
export interface AvailabilityBlock {
  block_date: string; // "2025-01-15"
  start_time: string; // "14:00:00"
  end_time: string; // "16:00:00"
  reason?: string;
}

// Request: Criar bloqueio
export interface BlockCreateRequest {
  block_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

// Response: Agenda completa do instrutor (gerencial)
export interface InstructorAvailabilityResponse {
  rules: AvailabilityRule[];
  blocks: AvailabilityBlock[];
}

/* =========================
 * ALUNO — AGENDA DERIVADA
 * (USO EXCLUSIVO DO ALUNO)
 * ========================= */

// Calendário mensal — dias disponíveis
// GET /instructors/{id}/calendar?month=YYYY-MM
export interface InstructorCalendarResponse {
  available_days: string[]; // ["2025-12-24", "2025-12-29"]
}

// Horários disponíveis por dia (hora cheia)
// GET /instructors/{id}/availability?date=YYYY-MM-DD
export interface InstructorDayAvailabilityResponse {
  date: string; // "2025-12-24"
  hours: string[]; // ["08:00", "09:00", "12:00", "13:00"]
}
