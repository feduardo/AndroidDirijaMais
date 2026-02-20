import httpClient from '../http/client';
import {
  BookingCreateRequest,
  BookingAPIResponse,
} from '../../domain/entities/BookingAPI.types';
import { StudentCancelRequest } from '../../domain/entities/BookingReason.types';

export class BookingRepository {
  /**
   * Criar novo booking (aluno)
   */
  async create(data: BookingCreateRequest): Promise<BookingAPIResponse> {
    const response = await httpClient.post<BookingAPIResponse>('/api/v1/bookings', data);
    return response.data;
  }

  /**
   * Cancelar booking (aluno)
   */
  async cancel(bookingId: string, data: StudentCancelRequest): Promise<void> {
    await httpClient.post(`/api/v1/bookings/${bookingId}/cancel`, data);
  }

  /**
   * Buscar detalhes de um booking
   */
  async getById(bookingId: string): Promise<BookingAPIResponse> {
    const response = await httpClient.get<BookingAPIResponse>(`/api/v1/bookings/${bookingId}`);
    return response.data;
  }

  /**
   * Listar bookings (genérico - usado para detalhes)
   * Observação: esse endpoint pode não ser o mesmo do instrutor.
   */
  async list(status?: string): Promise<BookingAPIResponse[]> {
    const params = status ? { status } : {};
    const response = await httpClient.get<BookingAPIResponse[]>('/api/v1/bookings', { params });
    return response.data;
  }

  /**
   * Listar bookings do aluno (com dados completos do instrutor + start_code)
   */
  async listStudentBookings(status?: string): Promise<BookingAPIResponse[]> {
    const params = status ? { status } : {};
    const response = await httpClient.get<BookingAPIResponse[]>(
      '/api/v1/bookings/student/bookings',
      { params }
    );
    return response.data;
  }

  /**
   * (INSTRUTOR) Listar bookings do instrutor
   * GET /api/v1/instructor/bookings
   * Agora inclui: payment_status, payment_method, can_accept
   */
  async listInstructorBookings(status?: string): Promise<BookingAPIResponse[]> {
    const params = status ? { status } : {};
    const response = await httpClient.get<BookingAPIResponse[]>(
      '/api/v1/instructor/bookings',
      { params }
    );
    return response.data;
  }

  /**
   * Confirmar booking (aluno)
   */
  async confirmBooking(bookingId: string): Promise<void> {
    await httpClient.post(`/api/v1/bookings/${bookingId}/confirm`);
  }

  /**
   * Disputar booking (aluno)
   */
  async disputeBooking(bookingId: string, reason: string): Promise<void> {
    await httpClient.post(`/api/v1/bookings/${bookingId}/dispute`, { reason });
  }

  /**
   * Criar review (aluno)
   */
  async createReview(
    bookingId: string,
    reviewData: {
      rating: number;
      cordiality_check: boolean;
      punctuality_check: boolean;
      clarity_check: boolean;
      safety_check: boolean;
      patience_check: boolean;
      comment?: string;
    }
  ): Promise<void> {
    await httpClient.post(`/api/v1/bookings/${bookingId}/review`, reviewData);
  }

  /**
   * Buscar review (aluno)
   */
  async getReview(
    bookingId: string
  ): Promise<{
    id: string;
    booking_id: string;
    rating: number;
    cordiality_check: boolean;
    punctuality_check: boolean;
    safety_check: boolean;
    clarity_check: boolean;
    patience_check: boolean;
    comment?: string;
    created_at: string;
  } | null> {
    try {
      const response = await httpClient.get(`/api/v1/bookings/${bookingId}/review`);
      return response.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  }
}

export default new BookingRepository();
