import { ISimuladoRepository } from '../../domain/repositories/ISimuladoRepository';
import {
  Simulado,
  SimuladoAttempt,
  Question,
  SimuladoAnswer,
  SimuladoResult,
  SimuladoResultHistory,
} from '../../domain/entities/Simulado.entity';
import httpClient from '../http/client';

export class SimuladoRepository implements ISimuladoRepository {
  async listSimulados(): Promise<Simulado[]> {
    const response = await httpClient.get('/simulados');
    return response.data;
  }

  async startAttempt(simuladoId: string, deviceId: string): Promise<SimuladoAttempt> {
    const response = await httpClient.post(
      `/simulados/${simuladoId}/start`,
      {},
      {
        headers: {
          'X-Device-Id': deviceId,
        },
      }
    );
    return response.data;
  }

  async getQuestions(attemptId: string, deviceId: string): Promise<Question[]> {
    const response = await httpClient.get(`/simulados/attempts/${attemptId}/questions`, {
      headers: {
        'X-Device-Id': deviceId,
      },
    });
    return response.data.questions;
  }

  async submitAnswer(
    attemptId: string,
    answer: SimuladoAnswer,
    deviceId: string
  ): Promise<{ isCorrect: boolean }> {
    const response = await httpClient.post(
      `/simulados/attempts/${attemptId}/answers`,
      {
        question_id: answer.questionId,
        selected_index: answer.selectedIndex,
      },
      {
        headers: {
          'X-Device-Id': deviceId,
        },
      }
    );
    return { isCorrect: response.data.is_correct };
  }

  async finishAttempt(attemptId: string, deviceId: string): Promise<SimuladoResult> {
    const response = await httpClient.post(
      `/simulados/attempts/${attemptId}/finish`,
      {},
      {
        headers: {
          'X-Device-Id': deviceId,
        },
      }
    );
    return {
      score: response.data.score,
      correctCount: response.data.correct_count,
      wrongCount: response.data.wrong_count,
      finishedAt: response.data.finished_at,
    };
  }

  async getMyResults(accessToken: string): Promise<SimuladoResultHistory[]> {
    const response = await httpClient.get('/simulados/me/results', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items.map((item: any) => ({
      attemptId: item.attempt_id,
      simuladoTitle: item.simulado_title,
      score: item.score,
      correctCount: item.correct_count,
      wrongCount: item.wrong_count,
      status: item.status,
      startedAt: item.started_at,
      finishedAt: item.finished_at,
    }));
  }
}