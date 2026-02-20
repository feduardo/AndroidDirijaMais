import {
  IAuthRepository,
  RegisterData,
  RegisterResponse, // ADICIONAR IMPORT
} from '../../repositories/IAuthRepository';
import {
  RegisterFormData,
  RegisterDataValidator,
} from '../../entities/RegisterData.entity';

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(formData: RegisterFormData): Promise<RegisterResponse> {
    const errors = RegisterDataValidator.validate(formData);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const data: RegisterData = {
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      cpf: formData.cpf,
      role: formData.role,
    };

    const response = await this.authRepository.register(data);
    return response;
  }
}