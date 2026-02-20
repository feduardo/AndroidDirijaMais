// src/domain/entities/Location.entity.ts

export type LocationSource = 'gps' | 'manual' | 'profile';

export interface Location {
  city: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
  source: LocationSource;
  updatedAt?: Date;
}

export interface LocationRequest {
  city: string;
  state: string;
  country?: string;
  lat?: number;
  lng?: number;
  source: LocationSource;
}

export interface NearbyInstructor {
  id: string;
  name: string;
  city: string;
  state: string;
  distanceKm?: number;
  avatar?: string | null;
}

export interface NearbyInstructorsResponse {
  instructors: NearbyInstructor[];
  userLocation: {
    city: string;
    state: string;
  } | null;
}