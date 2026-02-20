// src/infrastructure/services/IBGEService.ts

interface IBGEState {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export class IBGEService {
  private readonly baseUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades';

  async getStates(): Promise<Array<{ value: string; label: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/estados?orderBy=nome`);
      const states: IBGEState[] = await response.json();

      return states.map(state => ({
        value: state.sigla,
        label: state.nome,
      }));
    } catch (error) {
      console.error('IBGEService.getStates error:', error);
      return [];
    }
  }

  async getCitiesByState(stateCode: string): Promise<Array<{ value: string; label: string }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/estados/${stateCode}/municipios?orderBy=nome`
      );
      const cities: IBGECity[] = await response.json();

      return cities.map(city => ({
        value: city.nome,
        label: city.nome,
      }));
    } catch (error) {
      console.error('IBGEService.getCitiesByState error:', error);
      return [];
    }
  }
}