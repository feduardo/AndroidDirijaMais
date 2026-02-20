import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { Question } from '../../entities/Simulado.entity';

interface GetQuestionsInput {
  attemptId: string;
  deviceId: string;
  topic?: string;
}

export class GetQuestionsUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: GetQuestionsInput): Promise<Question[]> {
    return this.repository.getQuestions(input.attemptId, input.deviceId, input.topic);
  }
}