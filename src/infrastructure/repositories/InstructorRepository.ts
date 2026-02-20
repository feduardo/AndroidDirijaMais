import httpClient from '../http/client';
import {
  InstructorDashboardResponse,
  BookingAPIResponse,
  InstructorAvailabilityResponse,
  AvailabilityRule,
  BlockCreateRequest,
} from '../../domain/entities/BookingAPI.types';
import { InstructorProfileCreateData, InstructorProfileResponse } from '../../domain/entities/Instructor.entity';
import { Instructor } from '../../domain/entities/Instructor.entity';

import ENV from '@/core/config/env';

import {
  BookingRejectRequest,
  InstructorCancelRequest,
} from '../../domain/entities/BookingReason.types';

import base64 from 'react-native-base64';

type UploadResult = { avatar_url: string } | { document_url: string };

type PickedImage = {
  uri: string;
  fileName?: string;
  type?: string; // ex: image/jpeg
};


export class InstructorRepository {
  /**
   * Dashboard do instrutor (KPIs)
   */
  async getDashboard(): Promise<InstructorDashboardResponse> {
    const response = await httpClient.get<InstructorDashboardResponse>(
      '/api/v1/instructor/dashboard'
    );
    return response.data;
  }

  /**
   * Listar bookings do instrutor (por status)
   */
  async listBookings(status?: string): Promise<BookingAPIResponse[]> {
    const params = status ? { status } : {};
    const response = await httpClient.get<BookingAPIResponse[]>(
      '/api/v1/instructor/bookings',
      { params }
    );
    return response.data;
  }

  async acceptBooking(bookingId: string): Promise<void> {
    await httpClient.post(`/api/v1/instructor/bookings/${bookingId}/accept`);
  }

  async rejectBooking(bookingId: string, data: BookingRejectRequest): Promise<void> {
    await httpClient.post(`/api/v1/instructor/bookings/${bookingId}/reject`, data);
  }

  async startBooking(bookingId: string, code: string): Promise<void> {
    await httpClient.post(`/api/v1/instructor/bookings/${bookingId}/start`, { code });
  }

  async finishBooking(bookingId: string): Promise<void> {
    await httpClient.post(`/api/v1/instructor/bookings/${bookingId}/finish`);
  }

  async cancelBooking(bookingId: string, data: InstructorCancelRequest): Promise<void> {
    await httpClient.post(`/api/v1/instructor/bookings/${bookingId}/cancel`, data);
  }

  async getBookingById(bookingId: string): Promise<BookingAPIResponse> {
    const response = await httpClient.get<BookingAPIResponse>(
      `/api/v1/instructor/bookings/${bookingId}`
    );
    return response.data;
  }

  /**
   * Obter agenda (regras + bloqueios)
   */
  async getAvailability(): Promise<InstructorAvailabilityResponse> {
    const response = await httpClient.get<InstructorAvailabilityResponse>(
      '/api/v1/instructor/availability'
    );
    return response.data;
  }

  /**
   * Definir disponibilidade semanal
   */
  async setAvailability(rules: AvailabilityRule[]): Promise<void> {
    await httpClient.post('/api/v1/instructor/availability', rules);
  }

  /**
   * Criar bloqueio pontual
   */
  async createBlock(data: BlockCreateRequest): Promise<void> {
    await httpClient.post('/api/v1/instructor/availability/blocks', data);
  }

  /**
   * Obter perfil do instrutor
   */
  async getProfile(): Promise<InstructorProfileResponse> {
    const response = await httpClient.get<InstructorProfileResponse>(
      '/api/v1/instructors/profile'
    );
    return response.data;
  }

  /**
 * Listar instrutores disponíveis
 */
 async listInstructors(): Promise<Instructor[]> {
  const response = await httpClient.get<any[]>('/api/v1/instructors/instructors');
  
  return response.data.map(item => ({
    id: item.id,
    user_id: item.user_id,
    name: item.name,
    avatar: item.avatar_url
      ? `${ENV.API_URL}${item.avatar_url}`
      : item.avatar || null,
    driverLicenseCategory: item.driverLicenseCategory || 'AB',
    teachingCategories: item.teachingCategories || ['A', 'B', 'AB'],
    rating: item.rating,
    pricePerHour: item.pricePerHour,
    bio: item.bio,
    experience: item.experience,
    totalClasses: item.totalClasses,
    vehicleModel: item.vehicleModel || 'Veículo do instrutor',
    vehicleYear: item.vehicleYear || 2023,
    location: item.location || {
      city: 'Contagem',
      state: 'MG',
    },
    specialties: item.specialties || [],
    available: item.available,
  }));
}

/**
   * Buscar instrutores próximos (baseado em localização do usuário)
   */
  async getNearbyInstructors(radius = 5): Promise<Instructor[]> {
    const response = await httpClient.get<{
      instructors: any[];
      userLocation: { city: string; state: string } | null;
    }>(
      '/api/v1/instructors/nearby',
      { params: { radius } }
    );
    
    return response.data.instructors.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      avatar: item.avatar_url 
        ? `${ENV.API_URL}${item.avatar_url}` 
        : null,  // ← CORRIGIDO: usa avatar_url do backend
      driverLicenseCategory: 'AB',
      teachingCategories: ['A', 'B', 'AB'],
      rating: 4.5,
      pricePerHour: 80,
      bio: '',
      experience: 0,
      totalClasses: 0,
      vehicleModel: 'Veículo do instrutor',
      vehicleYear: 2023,
      location: {
        city: item.city,
        state: item.state,
      },
      specialties: [],
      available: true,
    }));
  }

  /**
   * Buscar instrutores próximos (rota pública para guests)
   */
  async getNearbyInstructorsPublic(city: string, state: string, radius = 5): Promise<Instructor[]> {
    const response = await httpClient.get<{
      instructors: any[];
      location: { city: string; state: string };
    }>(
      '/api/v1/instructors/public/nearbyhome',
      { 
        params: { city, state, radius } 
      }
    );
    
    return response.data.instructors.map((item: any) => ({
      id: item.id,
      name: item.name,
      avatar: `${ENV.API_URL}/public/avatars/${item.user_id ?? item.id}.jpg`,
      driverLicenseCategory: 'AB',
      teachingCategories: ['A', 'B', 'AB'],
      rating: 0,
      pricePerHour: 0,
      bio: '',
      experience: 0,
      totalClasses: 0,
      vehicleModel: '',
      vehicleYear: 0,
      location: {
        city: item.city,
        state: item.state,
      },
      specialties: [],
      available: true,
      user_id: item.id,
    }));
  }


  /**
   * Criar perfil do instrutor
   */
  async createProfile(data: InstructorProfileCreateData): Promise<InstructorProfileResponse> {
    const response = await httpClient.post<InstructorProfileResponse>(
      '/api/v1/instructors/profile',
      data
    );
    return response.data;
  }

  // InstructorRepository.ts
  async updateProfile(data: InstructorProfileCreateData): Promise<InstructorProfileResponse> {
    const response = await httpClient.put<InstructorProfileResponse>(
      '/api/v1/instructors/profile',
      data
    );
    return response.data;
  }
    async uploadAvatar(image: PickedImage): Promise<{ avatar_url: string }> {
    const form = new FormData();

    form.append('file', {
      uri: image.uri,
      name: image.fileName || 'avatar.jpg',
      type: image.type || 'image/jpeg',
    } as any);

    const response = await httpClient.post<{ avatar_url: string }>(
      '/api/v1/auth/avatar',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async uploadCnhPhoto(image: PickedImage): Promise<{ document_url: string }> {
    const form = new FormData();

    form.append('file', {
      uri: image.uri,
      name: image.fileName || 'cnh.jpg',
      type: image.type || 'image/jpeg',
    } as any);

    const response = await httpClient.post<{ document_url: string }>(
      '/api/v1/instructors/documents/cnh/photo',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async getCnhPhoto(): Promise<string | null> {
    try {
      const response = await httpClient.get(
        '/api/v1/instructors/documents/cnh/photo',
        {
          responseType: 'arraybuffer',
        }
      );

      // Converter arraybuffer para base64
      const bytes = new Uint8Array(response.data);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64String = base64.encode(binary);

      return `data:image/jpeg;base64,${base64String}`;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

}

export default new InstructorRepository();