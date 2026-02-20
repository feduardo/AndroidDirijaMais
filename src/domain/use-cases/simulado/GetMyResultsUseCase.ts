import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoResultHistory } from '../../entities/Simulado.entity';

interface GetMyResultsInput {
  accessToken: string;
}

export class GetMyResultsUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(input: GetMyResultsInput): Promise<SimuladoResultHistory[]> {
    return this.repository.getMyResults(input.accessToken);
  }
}