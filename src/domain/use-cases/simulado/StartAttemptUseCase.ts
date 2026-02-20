import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoAttempt } from '../../entities/Simulado.entity';

interface StartAttemptInput {
  simuladoId: string;
  deviceId: string;
}

export class StartAttemptUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: StartAttemptInput): Promise<SimuladoAttempt> {
    return this.repository.startAttempt(input.simuladoId, input.deviceId);
  }
}