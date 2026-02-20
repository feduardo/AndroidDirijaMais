import { RegisterData } from '../repositories/IAuthRepository';

export class RegisterDataValidator {
  static validate(
    data: RegisterFormData
  ): string[] {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!data.email?.trim()) {
      errors.push('Email é obrigatório');
    }

    if (!data.cpf?.trim()) {
      errors.push('CPF é obrigatório');
    }

    if (!data.phone?.trim()) {
      errors.push('Telefone é obrigatório');
    }

    if (!data.password) {
      errors.push('Senha é obrigatória');
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Senhas não conferem');
    }

    if (!data.acceptedTerms) {
      errors.push('Aceite os termos de uso');
    }

    if (!data.role) {
      errors.push('Tipo de usuário é obrigatório');
    }

    return errors;
  }
}

export interface RegisterFormData {
  name: string;              // Mantém "name" para o formulário
  full_name?: string;        // ADICIONAR (opcional, será preenchido no UseCase)
  email: string;
  password: string;
  phone: string;
  cpf: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  role: 'student' | 'instructor';
  device_type: 'web' | 'android' | 'ios';
  cnh_category?: 'A' | 'B' | 'C' | 'D' | 'E' | 'AB';
  city?: string;
  state?: string;
  price_per_hour?: number;
}
