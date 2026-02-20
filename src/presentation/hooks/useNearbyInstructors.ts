// src/presentation/hooks/useNearbyInstructors.ts

import { useState } from 'react';
import InstructorRepository from '@/infrastructure/repositories/InstructorRepository';

interface NearbyInstructor {
  id: string;
  name: string;
  city: string;
  state: string;
  distanceKm?: number;
  avatar?: string | null;
}

export const useNearbyInstructors = () => {
  const [instructors, setInstructors] = useState<NearbyInstructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInstructors = async (city: string, state: string, radius = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await InstructorRepository.getNearbyInstructorsPublic(
        city,
        state,
        radius
      );
      
      const simplified = data.map(instructor => ({
        id: instructor.id,
        name: instructor.name,
        city: instructor.location?.city || '',
        state: instructor.location?.state || '',
        distanceKm: undefined,
        avatar: instructor.avatar ?? null,
      }));
      
      setInstructors(simplified);
    } catch (err: any) {
      console.error('Erro ao buscar instrutores:', err);
      setInstructors([]);
      setError('Erro ao buscar instrutores');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    instructors,
    isLoading,
    error,
    loadInstructors,
  };
};