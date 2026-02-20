import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, Button } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { useAuthStore } from '../../state/authStore';
import { SimuladoResultHistory } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SimuladoHistoryScreenProps {
  navigation: any;
}


const getTopicDisplay = (topic: string | null): string => {
  if (!topic) return 'Geral';
  
  const topicNames: Record<string, string> = {
    DIRECAO_DEFENSIVA: 'Direção Defensiva',
    LEGISLACAO: 'Legislação',
    MECANICA_BASICA: 'Mecânica Básica',
    MEIO_AMBIENTE_CIDADANIA: 'Meio Ambiente e Cidadania',
    PRIMEIROS_SOCORROS: 'Primeiros Socorros',
    SINALIZACAO: 'Sinalização',
  };
  
  return topicNames[topic] || topic;
};

export const SimuladoHistoryScreen: React.FC<SimuladoHistoryScreenProps> = ({
  navigation,
}) => {
  const { getMyResults, loading } = useSimulado();
  const { token } = useAuthStore();
  const [results, setResults] = useState<SimuladoResultHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    if (!token) return;
    try {
      const data = await getMyResults(token);
      setResults(data);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return dateString;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={item => item.attemptId}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <View style={styles.titleContainer}>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.simuladoTitle}
                  </Text>
                  <Text variant="bodySmall" style={styles.topicBadge}>
                    {getTopicDisplay(item.topic)}
                  </Text>
                </View>
                <Chip
                  mode="flat"
                  style={[
                    styles.scoreChip,
                    { backgroundColor: getScoreColor(item.score) },
                  ]}
                  textStyle={styles.scoreChipText}
                >
                  {Math.round(item.score)}%
                </Chip>
              </View>

              <Text variant="bodySmall" style={styles.date}>
                {formatDate(item.finishedAt || item.startedAt)}
              </Text>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={styles.correctText}>
                    {item.correctCount}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Acertos
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={styles.wrongText}>
                    {item.wrongCount}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Erros
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={styles.totalText}>
                    {item.correctCount + item.wrongCount}
                  </Text>
                  <Text variant="bodySmall" style={styles.statLabel}>
                    Total
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('SimuladoReview', { attemptId: item.attemptId })}
                compact
              >
                Ver Questões
              </Button>
            </Card.Actions>          
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Nenhum simulado realizado ainda
            </Text>
            <Text variant="bodySmall" style={styles.emptySubtext}>
              Faça seu primeiro simulado para ver o histórico aqui
            </Text>
          </View>
        }
      />
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
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  scoreChip: {
    marginLeft: 8,
  },
  scoreChipText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  date: {
    color: colors.textSecondary,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  correctText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  wrongText: {
    color: colors.error,
    fontWeight: 'bold',
  },
  totalText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: colors.textSecondary,
  },

  titleContainer: {
  flex: 1,
  },
  topicBadge: {
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },

});