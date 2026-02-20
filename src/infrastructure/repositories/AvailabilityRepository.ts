import httpClient from '../http/client';
import {
  InstructorAvailability,
  CreateAvailabilityPayload,
  InstructorBlock,
  CreateBlockPayload,
} from '../../domain/entities/Availability.entity';

export class AvailabilityRepository {
  private readonly basePath = '/api/v1/instructor/availability';

  async getAvailability(): Promise<InstructorAvailability[]> {
    const response = await httpClient.get<InstructorAvailability[]>(this.basePath);
    return response.data;
  }

  async createAvailability(payload: CreateAvailabilityPayload): Promise<InstructorAvailability> {
    const response = await httpClient.post<InstructorAvailability>(this.basePath, payload);
    return response.data;
  }

  async deleteAvailability(id: string): Promise<void> {
    await httpClient.delete(`${this.basePath}/${id}`);
  }

  async getBlocks(): Promise<InstructorBlock[]> {
    const response = await httpClient.get<InstructorBlock[]>(`${this.basePath}/blocks`);
    return response.data;
  }

  async createBlock(payload: CreateBlockPayload): Promise<InstructorBlock> {
    const response = await httpClient.post<InstructorBlock>(`${this.basePath}/blocks`, payload);
    return response.data;
  }

  async deleteBlock(id: string): Promise<void> {
    await httpClient.delete(`${this.basePath}/blocks/${id}`);
  }
}

export const availabilityRepository = new AvailabilityRepository();