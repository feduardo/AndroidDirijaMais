import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { Simulado, SimuladoTopic } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';

interface SimuladosListScreenProps {
  navigation: any;
}

export const SimuladosListScreen: React.FC<SimuladosListScreenProps> = ({ navigation }) => {
  const { listSimulados, listTopics, loading, error } = useSimulado();
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [topics, setTopics] = useState<SimuladoTopic[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [simuladosData, topicsData] = await Promise.all([
        listSimulados(),
        listTopics(),
      ]);
      setSimulados(simuladosData);
      setTopics(topicsData);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const handleStartGeral = (simulado: Simulado) => {
    navigation.navigate('SimuladoExecution', {
      simuladoId: simulado.id,
      topic: undefined,
    });
  };

  const handleStartTematico = (simulado: Simulado, topic: string) => {
    navigation.navigate('SimuladoExecution', {
      simuladoId: simulado.id,
      topic,
    });
  };

  if (loading) {
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
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
          Tentar Novamente
        </Button>
      </View>
    );
  }

  const mainSimulado = simulados[0];

  return (
    <ScrollView style={styles.container}>
      {mainSimulado && (
        <>
          {/* Simulado Geral */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Simulado Geral
            </Text>
          </View>

          <Card style={styles.geralCard}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleLarge" style={styles.cardTitle}>
                  {mainSimulado.title}
                </Text>
                <Chip mode="flat" style={styles.chip}>
                  {mainSimulado.questionCount} questões
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.cardDescription}>
                {mainSimulado.description}
              </Text>
              <Text variant="bodySmall" style={styles.cardInfo}>
                Todas as questões misturadas, simulando a prova real
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => handleStartGeral(mainSimulado)}>
                Iniciar Geral
              </Button>
            </Card.Actions>
          </Card>

          <Divider style={styles.divider} />

          {/* Simulados Temáticos */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Simulados por Tema
            </Text>
            <Text variant="bodySmall" style={styles.sectionSubtitle}>
              Pratique temas específicos
            </Text>
          </View>

          {topics.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  Nenhum tema disponível no momento
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <View style={styles.topicsContainer}>
              {topics.map(topic => (
                <Card key={topic.topic} style={styles.topicCard}>
                  <Card.Content>
                    <Text variant="titleMedium" style={styles.topicTitle}>
                      {topic.displayName}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      mode="outlined"
                      onPress={() => handleStartTematico(mainSimulado, topic.topic)}
                    >
                      Iniciar
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
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
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },
  geralCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.primaryLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  chip: {
    backgroundColor: colors.primary,
  },
  cardDescription: {
    marginBottom: 8,
  },
  cardInfo: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 16,
  },
  topicsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  topicCard: {
    marginBottom: 12,
  },
  topicTitle: {
    fontWeight: '600',
  },
  emptyCard: {
    marginHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
});