export interface Instructor {
  id: string;
  user_id: string; 
  name: string;
  avatar: string | null;
  driverLicenseCategory: string;
  teachingCategories: string[];
  rating: number;
  pricePerHour: number;
  bio?: string;
  experience?: number;
  totalClasses?: number;
  vehicleModel?: string;
  vehicleYear?: number;
  acceptsStudentVehicle?: boolean;
  location?: {
    city: string;
    state: string;
  };
  specialties?: string[];
  available?: boolean;
  category?: string;
}

export interface VehiclePayload {
  brand: string;
  model: string;
  year: number;
  plate: string;
}

export interface CNHPayload {
  number: string;
  expires_at: string;
  categories: Array<"A" | "B" | "C" | "D" | "E" | "AB">;
}

export interface ManualAddressPayload {
  state: string;
  city: string;
  street: string;
  neighborhood: string;
}

export interface InstructorProfileCreateData {
  cep: string;
  address_number: string;
  address_complement?: string;
  categories: Array<"A" | "B" | "C" | "D" | "E" | "AB">;
  price_per_hour: number;
  experience_years: number;
  has_own_vehicle: boolean;
  accepts_student_vehicle: boolean;
  vehicle?: VehiclePayload;
  cnh: CNHPayload;
  manual_address?: ManualAddressPayload;
}

export interface InstructorProfileResponse {
  id: string;
  user_id: string;
  price_per_hour: number;
  experience_years: number;
  has_own_vehicle: boolean;
  accepts_student_vehicle: boolean;
  categories: string[];
  address: {
    cep: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
  };
  vehicle?: {
    brand: string;
    model: string;
    year: number;
    plate: string;
  };
  cnh: {
    number: string;
    expires_at: string;
    categories: string[];
  };
  bio?: string | null;
}