import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoReview } from '../../entities/Simulado.entity';

interface GetReviewInput {
  attemptId: string;
  accessToken: string;
}

export class GetReviewUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: GetReviewInput): Promise<SimuladoReview> {
    return this.repository.getReview(input.attemptId, input.accessToken);
  }
}