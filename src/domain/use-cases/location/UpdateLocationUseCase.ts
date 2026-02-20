// src/domain/use-cases/location/UpdateLocationUseCase.ts

import { ILocationRepository } from '@/domain/repositories/ILocationRepository';
import { Location, LocationRequest } from '@/domain/entities/Location.entity';

export class UpdateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(data: LocationRequest): Promise<Location> {
    return await this.locationRepository.updateLocation(data);
  }
}