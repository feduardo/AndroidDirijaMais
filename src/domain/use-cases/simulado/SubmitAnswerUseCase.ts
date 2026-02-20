import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoAnswer } from '../../entities/Simulado.entity';

interface SubmitAnswerInput {
  attemptId: string;
  questionId: string;
  selectedIndex: number;
  deviceId: string;
}

export class SubmitAnswerUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: SubmitAnswerInput): Promise<{ isCorrect: boolean }> {
    const answer: SimuladoAnswer = {
      questionId: input.questionId,
      selectedIndex: input.selectedIndex,
    };

    return this.repository.submitAnswer(input.attemptId, answer, input.deviceId);
  }
}
