export interface Question {
  id: string;
  topic: string;
  statement: string;
  alternatives: string[];
  imageUrl?: string;
}

export interface SimuladoAttempt {
  id: string;
  simuladoId: string;
  status: 'in_progress' | 'finished';
  startedAt: string;
  finishedAt?: string;
}

export interface SimuladoAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect?: boolean;
}

export interface SimuladoResult {
  score: number;
  correctCount: number;
  wrongCount: number;
  finishedAt: string;
}

export interface Simulado {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isActive: boolean;
}

export interface SimuladoResultHistory {
  attemptId: string;
  simuladoTitle: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  status: string;
  startedAt: string;
  finishedAt?: string;
  topic: string | null;
}

export interface SimuladoTopic {
  topic: string;
  displayName: string;
}

export interface QuestionReview {
  questionId: string;
  order: number;
  topic: string;
  statement: string;
  alternatives: string[];
  correctIndex: number;
  userSelectedIndex: number;
  isCorrect: boolean;
}

export interface SimuladoReview {
  attemptId: string;
  simuladoTitle: string;
  topic: string | null;
  score: number;
  correctCount: number;
  wrongCount: number;
  finishedAt: string;
  questions: QuestionReview[];
}