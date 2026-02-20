import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { SimuladoTopic } from '../../entities/Simulado.entity';

export class ListTopicsUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(): Promise<SimuladoTopic[]> {
    return this.repository.listTopics();
  }
}