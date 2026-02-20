import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Divider, Chip } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { useAuthStore } from '../../state/authStore';
import { Simulado, SimuladoResultHistory, SimuladoTopic } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { styles } from './StudentSimuladosScreen.styles';

interface StudentSimuladosScreenProps {
  navigation: any;
}

export const StudentSimuladosScreen: React.FC<StudentSimuladosScreenProps> = ({ navigation }) => {
  const { listSimulados, listTopics, getMyResults, loading } = useSimulado();
  const { token } = useAuthStore();
  
  const [simulados, setSimulados] = useState<Simulado[]>([]);
  const [topics, setTopics] = useState<SimuladoTopic[]>([]);
  const [results, setResults] = useState<SimuladoResultHistory[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [simuladosData, topicsData, resultsData] = await Promise.all([
        listSimulados(),
        listTopics(),
        token ? getMyResults(token) : Promise.resolve([]),
      ]);
      setSimulados(simuladosData);
      setTopics(topicsData);
      setResults(resultsData);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  // REMOVI a função formatDate já que não temos createdAt

  const getTopicDisplay = (topic: string | null): string => {
    if (!topic) return 'Geral';
    console.log('Results from list:', results[0]);
    
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

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Simulados
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Pratique e acompanhe seu progresso
        </Text>
      </View>

      {/* Seção: Meu Progresso */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Meu Progresso
          </Text>
          {results.length > 0 && (
            <Chip 
              icon="chart-line" 
              compact
              style={styles.progressChip}
            >
              {results.length} realizado{results.length !== 1 ? 's' : ''}
            </Chip>
          )}
        </View>

        {results.length === 0 ? (
          <Card style={styles.emptyCard} mode="contained">
            <Card.Content style={styles.emptyCardContent}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>📝</Text>
              </View>
              <Text variant="titleMedium" style={styles.emptyTitle}>
                Nenhum simulado realizado
              </Text>
              <Text variant="bodyMedium" style={styles.emptyDescription}>
                Comece fazendo seu primeiro simulado para acompanhar seu progresso
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.progressCard} mode="contained">
            <Card.Content>
              <View style={styles.progressHeader}>
                <View>
                  <Text variant="bodySmall" style={styles.progressLabel}>
                    Último simulado
                  </Text>
                  <Text variant="titleMedium" style={styles.progressTopic}>
                    {getTopicDisplay(results[0].topic)}
                  </Text>
                  {/* REMOVIDO o progressDate já que não temos data */}
                </View>
                <View style={styles.scoreBadge}>
                  <Text variant="headlineSmall" style={styles.scorePercentage}>
                    {Math.round(results[0].score)}%
                  </Text>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.correctCircle]}>
                    <Text variant="titleLarge" style={styles.correctText}>
                      {results[0].correctCount}
                    </Text>
                  </View>
                  <Text variant="labelSmall" style={styles.statLabel}>
                    Acertos
                  </Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={[styles.statCircle, styles.wrongCircle]}>
                    <Text variant="titleLarge" style={styles.wrongText}>
                      {results[0].wrongCount}
                    </Text>
                  </View>
                  <Text variant="labelSmall" style={styles.statLabel}>
                    Erros
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions style={styles.progressActions}>
              <Button
                mode="outlined"
                icon="history"
                onPress={() => navigation.navigate('SimuladoHistory')}
                style={styles.historyButton}
              >
                Ver Histórico Completo
              </Button>
            </Card.Actions>
          </Card>
        )}
      </View>

      {/* Divider */}
      <Divider style={styles.divider} />

      {/* Seção: Praticar */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Praticar
          </Text>
          <Chip compact style={styles.practiceChip}>
            {topics.length + simulados.length} opções
          </Chip>
        </View>

        {/* Simulados Gerais */}
        {simulados.map(simulado => (
          <Card key={simulado.id} style={styles.simuladoCard} mode="elevated">
            <Card.Content>
              <View style={styles.simuladoHeader}>
                <View style={styles.simuladoBadge}>
                  <Text style={styles.badgeText}>GERAL</Text>
                </View>
                <Text variant="bodySmall" style={styles.questionCount}>
                  {simulado.questionCount} questões
                </Text>
              </View>
              
              <Text variant="titleLarge" style={styles.simuladoTitle}>
                {simulado.title}
              </Text>
              
              <Text variant="bodyMedium" style={styles.simuladoDescription}>
                {simulado.description}
              </Text>

              {topics.length > 0 && (
                <View style={styles.topicsContainer}>
                  <Text variant="bodySmall" style={styles.topicsLabel}>
                    Todos os temas incluídos:
                  </Text>
                  <View style={styles.topicsList}>
                    {topics.slice(0, 3).map(topic => (
                      <Chip 
                        key={topic.topic} 
                        mode="outlined"
                        compact
                        style={styles.topicChip}
                        textStyle={styles.topicChipText}
                      >
                        {topic.displayName.split(' ')[0]}
                      </Chip>
                    ))}
                    {topics.length > 3 && (
                      <Chip mode="outlined" compact style={styles.moreChip}>
                        +{topics.length - 3}
                      </Chip>
                    )}
                  </View>
                </View>
              )}
            </Card.Content>
            <Card.Actions style={styles.simuladoActions}>
              <Button
                mode="contained"
                icon="play-circle"
                onPress={() => handleStartGeral(simulado)}
                style={styles.startButton}
                contentStyle={styles.buttonContent}
              >
                Iniciar Simulado Geral
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {/* Simulados Temáticos */}
        {topics.length > 0 && (
          <>
            <Text variant="titleMedium" style={styles.subsectionTitle}>
              Simulados Temáticos
            </Text>
            <Text variant="bodyMedium" style={styles.subsectionDescription}>
              Pratique temas específicos
            </Text>

            <View style={styles.topicsGrid}>
              {topics.map(topic => (
                <Card 
                  key={topic.topic} 
                  style={styles.topicCard}
                  mode="contained"
                >
                  <Card.Content style={styles.topicCardContent}>
                    <Text variant="titleMedium" style={styles.topicName}>
                      {topic.displayName}
                    </Text>
                    <Text variant="bodySmall" style={styles.topicInfo}>
                      Foco em um tema específico
                    </Text>
                  </Card.Content>
                  <Card.Actions style={styles.topicCardActions}>
                    <Button
                      mode="outlined"
                      icon="arrow-right"
                      onPress={() => handleStartTematico(simulados[0], topic.topic)}
                      style={styles.topicButton}
                      compact
                    >
                      Praticar
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          </>
        )}
      </View>

      {/* Espaço final */}
      <View style={styles.footerSpace} />
    </ScrollView>
  );
};