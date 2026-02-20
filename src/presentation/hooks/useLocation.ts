// src/presentation/hooks/useLocation.ts

import { useLocationStore } from '../state/locationStore';
import { LocationRepository } from '@/infrastructure/repositories/LocationRepository';
import { UpdateLocationUseCase } from '@/domain/use-cases/location/UpdateLocationUseCase';
import { LocationRequest } from '@/domain/entities/Location.entity';
import { useAuth } from './useAuth';

const locationRepository = new LocationRepository();
const updateLocationUseCase = new UpdateLocationUseCase(locationRepository);

export const useLocation = () => {
  const { user } = useAuth();
  const { location, isLoading, error, setLocation, setLoading, setError, clear } = useLocationStore();

  const loadCachedLocation = async () => {
    try {
      const cached = await locationRepository.getCachedLocation();
      setLocation(cached);
    } catch (err) {
      setError('Erro ao carregar localização');
    }
  };

  const updateLocation = async (data: LocationRequest) => {
    if (!user) {
      // Guest: só cachear localmente
      await locationRepository.setCachedLocation({
        ...data,
        country: data.country || 'BR',
        updatedAt: new Date(),
      });
      setLocation({
        ...data,
        country: data.country || 'BR',
        updatedAt: new Date(),
      });
      return;
    }

    // Usuário logado: enviar para backend
    try {
      setLoading(true);
      const result = await updateLocationUseCase.execute(data);
      setLocation(result);
    } catch (err) {
      setError('Erro ao atualizar localização');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    isLoading,
    error,
    updateLocation,
    loadCachedLocation,
    clearLocation: clear,
  };
};