import { ISimuladoRepository } from '../../repositories/ISimuladoRepository';
import { Simulado } from '../../entities/Simulado.entity';

export class ListSimuladosUseCase {
  constructor(private readonly repository: ISimuladoRepository) {}

  async execute(): Promise<Simulado[]> {
    return this.repository.listSimulados();
  }
}