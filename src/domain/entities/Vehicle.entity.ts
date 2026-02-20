export interface Vehicle {
  id: string;
  instructor_id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  transmission_type: 'manual' | 'automatic';
  photos: string[];
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreateDTO {
  brand: string;
  model: string;
  year: number;
  plate: string;
  transmission_type: 'manual' | 'automatic';
  photos?: string[];
  is_primary: boolean;
}

export interface VehicleUpdateDTO {
  brand?: string;
  model?: string;
  year?: number;
  plate?: string;
  transmission_type?: 'manual' | 'automatic';
  photos?: string[];
  is_primary?: boolean;
}