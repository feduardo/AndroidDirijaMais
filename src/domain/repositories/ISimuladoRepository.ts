import {
  Simulado,
  SimuladoAttempt,
  Question,
  SimuladoAnswer,
  SimuladoResult,
  SimuladoResultHistory,
  SimuladoTopic,
  SimuladoReview,
} from '../entities/Simulado.entity';

export interface ISimuladoRepository {
  listSimulados(): Promise<Simulado[]>;
  
  listTopics(): Promise<SimuladoTopic[]>;
  
  startAttempt(simuladoId: string, deviceId: string): Promise<SimuladoAttempt>;
  
  getQuestions(attemptId: string, deviceId: string, topic?: string): Promise<Question[]>;
  
  submitAnswer(
    attemptId: string,
    answer: SimuladoAnswer,
    deviceId: string
  ): Promise<{ isCorrect: boolean }>;
  
  finishAttempt(
    attemptId: string,
    deviceId: string
  ): Promise<SimuladoResult>;
  
  getMyResults(accessToken: string): Promise<SimuladoResultHistory[]>;
  
  getReview(attemptId: string, accessToken: string): Promise<SimuladoReview>;
}