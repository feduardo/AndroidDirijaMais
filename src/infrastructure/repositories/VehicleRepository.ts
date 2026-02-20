import apiClient from '../http/client';
import { Vehicle, VehicleCreateDTO, VehicleUpdateDTO } from '../../domain/entities/Vehicle.entity';

export class VehicleRepository {
  private readonly basePath = '/api/v1/instructor/vehicles';

  async create(data: VehicleCreateDTO): Promise<Vehicle> {
    const response = await apiClient.post<Vehicle>(this.basePath, data);
    return response.data;
  }

  async list(): Promise<{ vehicles: Vehicle[]; total: number }> {
    const response = await apiClient.get<{ vehicles: Vehicle[]; total: number }>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`${this.basePath}/${id}`);
    return response.data;
  }

  async update(id: string, data: VehicleUpdateDTO): Promise<Vehicle> {
    const response = await apiClient.patch<Vehicle>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}