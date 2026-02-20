import {
  Simulado,
  SimuladoAttempt,
  Question,
  SimuladoAnswer,
  SimuladoResult,
  SimuladoResultHistory,
  SimuladoTopic,
  SimuladoReview,
} from '../../domain/entities/Simulado.entity';
import api from '../http/client';
import { ISimuladoRepository } from '../../domain/repositories/ISimuladoRepository';
import httpClient from '../http/client';

export class SimuladoRepository implements ISimuladoRepository {
  async listSimulados(): Promise<Simulado[]> {
    const response = await api.get('/simulados');
    return response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        questionCount: item.questions_count,
        isActive: item.is_active ?? true,
      }));
    }

  async listTopics(): Promise<SimuladoTopic[]> {
    const response = await httpClient.get('/simulados/topics');
    
    const topicNames: Record<string, string> = {
      DIRECAO_DEFENSIVA: 'Direção Defensiva',
      LEGISLACAO: 'Legislação',
      MECANICA_BASICA: 'Mecânica Básica',
      MEIO_AMBIENTE_CIDADANIA: 'Meio Ambiente e Cidadania',
      PRIMEIROS_SOCORROS: 'Primeiros Socorros',
      SINALIZACAO: 'Sinalização',
    };

    return response.data.items.map((item: string) => ({
      topic: item,
      displayName: topicNames[item] || item,
    }));
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
    
    return {
      id: response.data.attempt_id,
      simuladoId: response.data.simulado_id,
      status: response.data.status,
      startedAt: response.data.started_at,
      finishedAt: response.data.finished_at,
    };
  }

  async getQuestions(attemptId: string, deviceId: string, topic?: string): Promise<Question[]> {
    console.log('🔍 Repository getQuestions - topic recebido:', topic);
    
    const params = topic ? { topic } : {};
    console.log('📦 Repository - params montados:', params);
    
    const response = await httpClient.get(`/simulados/attempts/${attemptId}/questions`, {
      headers: {
        'X-Device-Id': deviceId,
      },
      params,
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
    const response = await api.get('/simulados/me/results', {
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
      topic: item.topic,
    }));
  }

  async getReview(attemptId: string, accessToken: string): Promise<SimuladoReview> {
    const response = await httpClient.get(`/simulados/attempts/${attemptId}/review`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      attemptId: response.data.attempt_id,
      simuladoTitle: response.data.simulado_title,
      topic: response.data.topic,
      score: response.data.score,
      correctCount: response.data.correct_count,
      wrongCount: response.data.wrong_count,
      finishedAt: response.data.finished_at,
      questions: response.data.questions.map((q: any) => ({
        questionId: q.question_id,
        order: q.order,
        topic: q.topic,
        statement: q.statement,
        alternatives: q.alternatives,
        correctIndex: q.correct_index,
        userSelectedIndex: q.user_selected_index,
        isCorrect: q.is_correct,
      })),
    };
  }
}


