import { useState, useCallback } from 'react';
import { SimuladoRepository } from '../../infrastructure/repositories/SimuladoRepository';
import { ListSimuladosUseCase } from '../../domain/use-cases/simulado/ListSimuladosUseCase';
import { StartAttemptUseCase } from '../../domain/use-cases/simulado/StartAttemptUseCase';
import { GetQuestionsUseCase } from '../../domain/use-cases/simulado/GetQuestionsUseCase';
import { SubmitAnswerUseCase } from '../../domain/use-cases/simulado/SubmitAnswerUseCase';
import { FinishAttemptUseCase } from '../../domain/use-cases/simulado/FinishAttemptUseCase';
import { GetMyResultsUseCase } from '../../domain/use-cases/simulado/GetMyResultsUseCase';
import {
  Simulado,
  SimuladoAttempt,
  Question,
  SimuladoResult,
  SimuladoResultHistory,
} from '../../domain/entities/Simulado.entity';
import DeviceIdManager from '../../infrastructure/storage/DeviceIdManager';
import { AppError } from '../../shared/errors/AppError';
import { ListTopicsUseCase } from '../../domain/use-cases/simulado/ListTopicsUseCase';
import { SimuladoTopic } from '../../domain/entities/Simulado.entity';
import { GetReviewUseCase } from '../../domain/use-cases/simulado/GetReviewUseCase';
import { SimuladoReview } from '../../domain/entities/Simulado.entity';

const repository = new SimuladoRepository();
const listSimuladosUseCase = new ListSimuladosUseCase(repository);
const startAttemptUseCase = new StartAttemptUseCase(repository);
const getQuestionsUseCase = new GetQuestionsUseCase(repository);
const submitAnswerUseCase = new SubmitAnswerUseCase(repository);
const finishAttemptUseCase = new FinishAttemptUseCase(repository);
const getMyResultsUseCase = new GetMyResultsUseCase(repository);
const listTopicsUseCase = new ListTopicsUseCase(repository);
const getReviewUseCase = new GetReviewUseCase(repository);

export const useSimulado = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listSimulados = useCallback(async (): Promise<Simulado[]> => {
    try {
      setLoading(true);
      setError(null);
      return await listSimuladosUseCase.execute();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar simulados';
      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const startAttempt = useCallback(async (simuladoId: string): Promise<SimuladoAttempt> => {
    try {
      setLoading(true);
      setError(null);
      const deviceId = await DeviceIdManager.getDeviceId();
      return await startAttemptUseCase.execute({ simuladoId, deviceId });
    } catch (err: any) {
      const status = err.response?.status;
      let message = 'Erro ao iniciar simulado';

      if (status === 404) {
        message = 'Simulado indisponível';
      }

      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuestions = useCallback(async (attemptId: string, topic?: string): Promise<Question[]> => {
    try {
      setLoading(true);
      setError(null);
      const deviceId = await DeviceIdManager.getDeviceId();
      return await getQuestionsUseCase.execute({ attemptId, deviceId, topic });
    } catch (err: any) {
      const status = err.response?.status;
      let message = 'Erro ao carregar questões';

      if (status === 403 || status === 404) {
        message = 'Sessão inválida, reinicie o simulado';
      }

      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (attemptId: string, questionId: string, selectedIndex: number): Promise<boolean> => {
      try {
        setError(null);
        const deviceId = await DeviceIdManager.getDeviceId();
        const result = await submitAnswerUseCase.execute({
          attemptId,
          questionId,
          selectedIndex,
          deviceId,
        });
        return result.isCorrect;
      } catch (err: any) {
        const status = err.response?.status;

        if (status === 409) {
          // Questão já respondida - ignorar silenciosamente
          return false;
        }

        if (status === 400) {
          throw new AppError('Resposta inválida');
        }

        if (status === 403) {
          throw new AppError('Sessão inválida, reinicie o simulado');
        }

        throw new AppError('Erro ao enviar resposta');
      }
    },
    []
  );

  const finishAttempt = useCallback(async (attemptId: string): Promise<SimuladoResult> => {
    try {
      setLoading(true);
      setError(null);
      const deviceId = await DeviceIdManager.getDeviceId();
      return await finishAttemptUseCase.execute({ attemptId, deviceId });
    } catch (err: any) {
      const status = err.response?.status;
      let message = 'Erro ao finalizar simulado';

      if (status === 400) {
        message = 'Simulado não pode ser finalizado';
      }

      if (status === 403) {
        message = 'Sessão inválida, reinicie o simulado';
      }

      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyResults = useCallback(async (accessToken: string): Promise<SimuladoResultHistory[]> => {
    try {
      setLoading(true);
      setError(null);
      return await getMyResultsUseCase.execute({ accessToken });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar resultados';
      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const listTopics = useCallback(async (): Promise<SimuladoTopic[]> => {
    try {
      setLoading(true);
      setError(null);
      return await listTopicsUseCase.execute();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar tópicos';
      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getReview = useCallback(async (attemptId: string, accessToken: string): Promise<SimuladoReview> => {
    try {
      setLoading(true);
      setError(null);
      return await getReviewUseCase.execute({ attemptId, accessToken });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar revisão';
      setError(message);
      throw new AppError(message);
    } finally {
      setLoading(false);
    }
  }, []);    
  
  return {
    loading,
    error,
    listSimulados,
    listTopics,
    startAttempt,
    getQuestions,
    submitAnswer,
    finishAttempt,
    getMyResults,
    getReview,
  };
};