import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

/**
 * Timezone do Brasil (São Paulo)
 * Ajusta automaticamente para horário de verão
 */
const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converte data local para UTC ISO string
 * Usado para enviar ao backend
 * 
 * @example
 * toUTC(new Date(2025, 0, 10, 15, 0)) // "2025-01-10T18:00:00.000Z"
 */
export const toUTC = (date: Date): string => {
  const utcDate = fromZonedTime(date, BRAZIL_TIMEZONE);
  return utcDate.toISOString();
};

/**
 * Converte UTC ISO string para data local
 * Usado para exibir datas vindas do backend
 * 
 * @example
 * fromUTC("2025-01-10T18:00:00Z") // Date local: 10/01/2025 15:00
 */
export const fromUTC = (isoString: string): Date => {
  const utcDate = parseISO(isoString);
  return toZonedTime(utcDate, BRAZIL_TIMEZONE);
};

/**
 * Formata data local para exibição
 * 
 * @example
 * formatLocalDate(new Date()) // "23/12/2024"
 */
export const formatLocalDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Formata data local completa (com dia da semana)
 * 
 * @example
 * formatLocalDateFull(new Date()) // "segunda-feira, 23 de dezembro de 2024"
 */
export const formatLocalDateFull = (date: Date): string => {
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formata hora local
 * 
 * @example
 * formatLocalTime(new Date()) // "15:30"
 */
export const formatLocalTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Formata data e hora local
 * 
 * @example
 * formatLocalDateTime(new Date()) // "23/12/2024 15:30"
 */
export const formatLocalDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

/**
 * Converte string UTC do backend para exibição formatada
 * Atalho: fromUTC + formatLocalDateTime
 * 
 * @example
 * formatUTCToLocal("2025-01-10T18:00:00Z") // "10/01/2025 15:00"
 */
export const formatUTCToLocal = (isoString: string): string => {
  const localDate = fromUTC(isoString);
  return formatLocalDateTime(localDate);
};