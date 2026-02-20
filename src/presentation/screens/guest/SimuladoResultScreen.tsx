import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ActivityIndicator } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { SimuladoResult } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';
import { useAuthStore } from '../../state/authStore';

interface SimuladoResultScreenProps {
  navigation: any;
  route: {
    params: {
      attemptId: string;
    };
  };
}

export const SimuladoResultScreen: React.FC<SimuladoResultScreenProps> = ({
  navigation,
  route,
}) => {
  const { attemptId } = route.params;
  const { finishAttempt, loading, error } = useSimulado();
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const { isAuthenticated } = useAuthStore();

  // 1. Verificar o que está vindo do backend
  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const data = await finishAttempt(attemptId);
      console.log('Backend response:', data); // <-- ADD
      console.log('Score:', data.score); // <-- ADD
      console.log('Correct:', data.correctCount); // <-- ADD
      console.log('Wrong:', data.wrongCount); // <-- ADD
      console.log('Total:', data.correctCount + data.wrongCount); // <-- ADD
      setResult(data);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  const handleNewSimulado = () => {
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Erro ao carregar resultado'}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  const percentScore = Math.round(result.score);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Resultado do Simulado
        </Text>

        <Card style={styles.scoreCard}>
          <Card.Content>
            <Text variant="displayLarge" style={styles.scoreText}>
              {percentScore}%
            </Text>
            <Text variant="titleMedium" style={styles.scoreLabel}>
              de aproveitamento
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.correctText}>
                {result.correctCount}
              </Text>
              <Text variant="bodyMedium">Acertos</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.wrongText}>
                {result.wrongCount}
              </Text>
              <Text variant="bodyMedium">Erros</Text>
            </Card.Content>
          </Card>
        </View>

        {!isAuthenticated && (
          <Card style={styles.ctaCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.ctaTitle}>
                Salve seus resultados!
              </Text>
              <Text variant="bodyMedium" style={styles.ctaDescription}>
                Crie uma conta ou faça login para acompanhar seu histórico e evolução
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>

      <View style={styles.footer}>
        {isAuthenticated ? (
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.primaryButton}
          >
            Fazer outro simulado
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={handleGoToLogin}
            style={styles.primaryButton}
          >
            Criar conta / Entrar para fazer mais
          </Button>
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  scoreCard: {
    marginBottom: 24,
    backgroundColor: colors.primary,
  },
  scoreText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreLabel: {
    textAlign: 'center',
    color: '#fff',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  correctText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  wrongText: {
    color: colors.error,
    fontWeight: 'bold',
  },
  ctaCard: {
    backgroundColor: colors.primaryLight,
  },
  ctaTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaDescription: {
    color: colors.textSecondary,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  primaryButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});