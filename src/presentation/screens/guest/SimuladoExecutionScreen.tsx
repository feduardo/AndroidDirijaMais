import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, RadioButton, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { Question } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';
import SecureStorage from '../../../infrastructure/storage/SecureStorage';

interface SimuladoExecutionScreenProps {
  navigation: any;
  route: {
    params: {
      simuladoId: string;
      topic?: string;
    };
  };
}

export const SimuladoExecutionScreen: React.FC<SimuladoExecutionScreenProps> = ({
  navigation,
  route,
}) => {
  const { simuladoId, topic } = route.params;
  console.log('🎯 Params recebidos:', route.params);
  console.log('🎯 SimuladoId:', simuladoId);
  console.log('🎯 Topic:', topic);
  const { startAttempt, getQuestions, submitAnswer, loading, error } = useSimulado();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initSimulado();
  }, []);

  const initSimulado = async () => {
    try {
      const currentTopic = route.params.topic;
      console.log('🎯 Topic do route.params:', currentTopic);
      
      const storageKey = `@simulado:attempt:${simuladoId}${currentTopic ? `:${currentTopic}` : ''}`;
      const storedAttemptId = await SecureStorage.getItem(storageKey);
      console.log('🔍 StoredAttemptId:', storedAttemptId);

      let currentAttemptId = storedAttemptId;

      if (!currentAttemptId) {
        const attempt = await startAttempt(simuladoId);
        console.log('✅ Attempt criado:', attempt);
        currentAttemptId = attempt.id;
        console.log('📝 AttemptId extraído:', currentAttemptId);
        await SecureStorage.setItem(storageKey, currentAttemptId);
      }

      setAttemptId(currentAttemptId);
      console.log('🎯 AttemptId setado no state:', currentAttemptId);

      console.log('📞 Chamando getQuestions com topic:', currentTopic);
      const questionsData = await getQuestions(currentAttemptId, currentTopic);
      console.log('📚 Questões carregadas:', questionsData.length);
      setQuestions(questionsData);
    } catch (err) {
      console.error('❌ Erro em initSimulado:', err);
    }
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !attemptId) return;

    const currentQuestion = questions[currentIndex];

    try {
      setSubmitting(true);
      await submitAnswer(attemptId, currentQuestion.id, selectedAnswer);

      setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));
      setSelectedAnswer(null);

      // Avançar para próxima questão ou finalizar
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Última questão respondida
        await SecureStorage.removeItem(`@simulado:attempt:${simuladoId}`);
        navigation.navigate('SimuladoResult', { attemptId });
      }
    } catch (err) {
      // Erro já tratado no hook
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !attemptId) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>Nenhuma questão disponível</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.progressText}>
          Questão {currentIndex + 1} de {questions.length}
        </Text>
        <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
        <Text variant="bodySmall" style={styles.topicText}>
          {currentQuestion.topic}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <Text variant="bodyLarge" style={styles.statement}>
          {currentQuestion.statement}
        </Text>

        <RadioButton.Group onValueChange={value => handleSelectAnswer(Number(value))} value={selectedAnswer?.toString() || ''}>
          {currentQuestion.alternatives.map((alternative, index) => (
            <View key={index} style={styles.alternativeContainer}>
              <RadioButton.Item
                label={alternative}
                value={index.toString()}
                labelStyle={styles.alternativeLabel}
              />
            </View>
          ))}
        </RadioButton.Group>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmitAnswer}
          disabled={selectedAnswer === null || submitting}
          loading={submitting}
          style={styles.submitButton}
        >
          {currentIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  topicText: {
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statement: {
    marginBottom: 24,
    lineHeight: 24,
  },
  alternativeContainer: {
    marginBottom: 8,
  },
  alternativeLabel: {
    textAlign: 'left',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    paddingVertical: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});