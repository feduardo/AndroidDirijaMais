// src/domain/repositories/ILocationRepository.ts

import { Location, LocationRequest, NearbyInstructorsResponse } from '../entities/Location.entity';

export interface ILocationRepository {
  updateLocation(data: LocationRequest): Promise<Location>;
  
  getNearbyInstructors(radius?: number): Promise<NearbyInstructorsResponse>;
  
  getCachedLocation(): Promise<Location | null>;
  
  setCachedLocation(location: Location): Promise<void>;
  
  clearCachedLocation(): Promise<void>;
}