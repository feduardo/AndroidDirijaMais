// src/infrastructure/repositories/LocationRepository.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../http/client';
import { ILocationRepository } from '@/domain/repositories/ILocationRepository';
import {
  Location,
  LocationRequest,
  NearbyInstructorsResponse,
} from '@/domain/entities/Location.entity';

const LOCATION_CACHE_KEY = '@dirijacerto:location';

export class LocationRepository implements ILocationRepository {
  async updateLocation(data: LocationRequest): Promise<Location> {
    const response = await apiClient.put<Location>(
      '/api/v1/user/location',
      data
    );
    
    await this.setCachedLocation(response.data);
    return response.data;
  }

  async getNearbyInstructors(radius = 5): Promise<NearbyInstructorsResponse> {
    const response = await apiClient.get<NearbyInstructorsResponse>(
      '/api/v1/instructors/nearby',
      { params: { radius } }
    );
    
    return response.data;
  }

  async getCachedLocation(): Promise<Location | null> {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return null;
      
      const location = JSON.parse(cached);
      
      if (location.updatedAt) {
        const age = Date.now() - new Date(location.updatedAt).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (age > sevenDays) {
          await this.clearCachedLocation();
          return null;
        }
      }
      
      return location;
    } catch {
      return null;
    }
  }

  async setCachedLocation(location: Location): Promise<void> {
    await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
  }

  async clearCachedLocation(): Promise<void> {
    await AsyncStorage.removeItem(LOCATION_CACHE_KEY);
  }
}