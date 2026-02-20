/**
 * Motivos de rejeição (instrutor → booking pendente)
 */
export enum RejectReasonCode {
  SCHEDULE_UNAVAILABLE = 'SCHEDULE_UNAVAILABLE',
  OUT_OF_AREA = 'OUT_OF_AREA',
  CATEGORY_MISMATCH = 'CATEGORY_MISMATCH',
  PERSONAL_EMERGENCY = 'PERSONAL_EMERGENCY',
  OTHER = 'OTHER',
}

/**
 * Motivos de cancelamento (instrutor → booking aceito)
 */
export enum InstructorCancelReasonCode {
  SCHEDULE_CONFLICT = 'SCHEDULE_CONFLICT',
  VEHICLE_ISSUE = 'VEHICLE_ISSUE',
  HEALTH_ISSUE = 'HEALTH_ISSUE',
  LOCATION_TOO_FAR = 'LOCATION_TOO_FAR',
  STUDENT_UNRESPONSIVE = 'STUDENT_UNRESPONSIVE',
  WEATHER = 'WEATHER',
  SAFETY_CONCERN = 'SAFETY_CONCERN',
  OTHER = 'OTHER',
}

/**
 * Request: Rejeitar booking
 */
export interface BookingRejectRequest {
  reason_code: RejectReasonCode;
  reason_text?: string; // obrigatório apenas se reason_code === OTHER
}

/**
 * Request: Cancelar booking (instrutor)
 */
export interface InstructorCancelRequest {
  reason_code: InstructorCancelReasonCode;
  reason_text?: string; // obrigatório apenas se reason_code === OTHER
}

/**
 * Labels para exibição
 */
export const REJECT_REASON_LABELS: Record<RejectReasonCode, string> = {
  [RejectReasonCode.SCHEDULE_UNAVAILABLE]: 'Sem disponibilidade',
  [RejectReasonCode.OUT_OF_AREA]: 'Fora da área de atendimento',
  [RejectReasonCode.CATEGORY_MISMATCH]: 'Categoria não atendida',
  [RejectReasonCode.PERSONAL_EMERGENCY]: 'Imprevisto pessoal',
  [RejectReasonCode.OTHER]: 'Outro motivo',
};

export const INSTRUCTOR_CANCEL_REASON_LABELS: Record<InstructorCancelReasonCode, string> = {
  [InstructorCancelReasonCode.SCHEDULE_CONFLICT]: 'Conflito de agenda',
  [InstructorCancelReasonCode.VEHICLE_ISSUE]: 'Problema com veículo',
  [InstructorCancelReasonCode.HEALTH_ISSUE]: 'Problema de saúde',
  [InstructorCancelReasonCode.LOCATION_TOO_FAR]: 'Local muito distante',
  [InstructorCancelReasonCode.STUDENT_UNRESPONSIVE]: 'Aluno não responde',
  [InstructorCancelReasonCode.WEATHER]: 'Condições climáticas',
  [InstructorCancelReasonCode.SAFETY_CONCERN]: 'Preocupação com segurança',
  [InstructorCancelReasonCode.OTHER]: 'Outro motivo',
};


/**
 * Motivos de cancelamento (aluno)
 */
export enum StudentCancelReasonCode {
  SCHEDULE_CONFLICT = 'SCHEDULE_CONFLICT',
  NO_LONGER_NEEDED = 'NO_LONGER_NEEDED',
  FOUND_ANOTHER_INSTRUCTOR = 'FOUND_ANOTHER_INSTRUCTOR',
  HEALTH_ISSUE = 'HEALTH_ISSUE',
  WEATHER = 'WEATHER',
  OTHER = 'OTHER',
}

/**
 * Request: Cancelar booking (aluno)
 */
export interface StudentCancelRequest {
  reason_code: StudentCancelReasonCode;
  reason_text?: string;
}

/**
 * Labels para exibição
 */
export const STUDENT_CANCEL_REASON_LABELS: Record<StudentCancelReasonCode, string> = {
  [StudentCancelReasonCode.SCHEDULE_CONFLICT]: 'Conflito de agenda',
  [StudentCancelReasonCode.NO_LONGER_NEEDED]: 'Não preciso mais',
  [StudentCancelReasonCode.FOUND_ANOTHER_INSTRUCTOR]: 'Encontrei outro instrutor',
  [StudentCancelReasonCode.HEALTH_ISSUE]: 'Problema de saúde',
  [StudentCancelReasonCode.WEATHER]: 'Condições climáticas',
  [StudentCancelReasonCode.OTHER]: 'Outro motivo',
};