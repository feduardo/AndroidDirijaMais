// src/presentation/state/locationStore.ts

import { create } from 'zustand';
import { Location } from '@/domain/entities/Location.entity';

interface LocationState {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  
  setLocation: (location: Location | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  location: null,
  isLoading: false,
  error: null,
  
  setLocation: (location) => set({ location, error: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  clear: () => set({ location: null, isLoading: false, error: null }),
}));