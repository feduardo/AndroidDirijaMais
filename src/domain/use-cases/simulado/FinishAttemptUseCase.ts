import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoResult } from '../../entities/Simulado.entity';

interface FinishAttemptInput {
  attemptId: string;
  deviceId: string;
}

export class FinishAttemptUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: FinishAttemptInput): Promise<SimuladoResult> {
    return this.repository.finishAttempt(input.attemptId, input.deviceId);
  }
}