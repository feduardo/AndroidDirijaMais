import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, ActivityIndicator, Chip, Divider, Button } from 'react-native-paper';
import { useSimulado } from '../../hooks/useSimulado';
import { useAuthStore } from '../../state/authStore';
import { SimuladoReview } from '../../../domain/entities/Simulado.entity';
import { colors } from '../../theme/colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { styles } from './SimuladoReviewScreen.styles';

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

interface SimuladoReviewScreenProps {
  navigation: any;
  route: {
    params: {
      attemptId: string;
    };
  };
}

export const SimuladoReviewScreen: React.FC<SimuladoReviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { attemptId } = route.params;
  const { getReview, loading, error } = useSimulado();
  const { token } = useAuthStore();
  const [review, setReview] = useState<SimuladoReview | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    if (!token) return;
    try {
      const data = await getReview(attemptId, token);
      setReview(data);
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReview();
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
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando revisão...</Text>
      </View>
    );
  }

  if (error || !review) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text variant="titleMedium" style={styles.errorTitle}>
          Não foi possível carregar a revisão
        </Text>
        <Text style={styles.errorMessage}>
          {error || 'Tente novamente mais tarde'}
        </Text>
        <Button
          mode="contained"
          onPress={loadReview}
          style={styles.retryButton}
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Informativo */}
      <View style={styles.header}>
        <Button
          icon="arrow-left"
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Voltar
        </Button>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Revisão do Simulado
        </Text>
      </View>

      {/* Resumo Geral */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <View style={styles.summaryHeader}>
            <View>
              <Text variant="titleLarge" style={styles.simuladoTitle}>
                {review.simuladoTitle}
              </Text>
              <View style={styles.topicContainer}>
                <Chip 
                  mode="outlined" 
                  compact
                  style={styles.topicChip}
                  textStyle={styles.topicChipText}
                >
                  {getTopicDisplay(review.topic)}
                </Chip>
                <Text style={styles.dateText}>
                  {formatDate(review.finishedAt)}
                </Text>
              </View>
            </View>
            
            <View style={[styles.scoreCircle, { borderColor: getScoreColor(review.score) }]}>
              <Text variant="headlineMedium" style={[styles.scoreText, { color: getScoreColor(review.score) }]}>
                {Math.round(review.score)}%
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Estatísticas */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text style={[styles.statIconText, { color: colors.success }]}>✓</Text>
              </View>
              <Text variant="titleLarge" style={styles.correctText}>
                {review.correctCount}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>
                Acertos
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(229, 57, 53, 0.1)' }]}>
                <Text style={[styles.statIconText, { color: colors.error }]}>✗</Text>
              </View>
              <Text variant="titleLarge" style={styles.wrongText}>
                {review.wrongCount}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>
                Erros
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]}>
                <Text style={[styles.statIconText, { color: colors.info }]}>∑</Text>
              </View>
              <Text variant="titleLarge" style={styles.totalText}>
                {review.correctCount + review.wrongCount}
              </Text>
              <Text variant="labelSmall" style={styles.statLabel}>
                Total
              </Text>
            </View>
          </View>

          <View style={styles.performanceContainer}>
            <Text variant="labelSmall" style={styles.performanceLabel}>
              Desempenho
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${review.score}%`,
                    backgroundColor: getScoreColor(review.score)
                  }
                ]} 
              />
            </View>
            <View style={styles.performanceMarks}>
              <Text style={styles.markText}>0%</Text>
              <Text style={styles.markText}>50%</Text>
              <Text style={styles.markText}>100%</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Navegação Rápida */}
      <View style={styles.navigationSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Questões ({review.questions.length})
        </Text>
        <View style={styles.questionIndicators}>
          {review.questions.map((question, index) => (
            <Chip
              key={question.questionId}
              mode="outlined"
              compact
              style={[
                styles.questionIndicator,
                question.isCorrect ? styles.correctIndicator : styles.wrongIndicator
              ]}
              onPress={() => {
                // Scroll para questão específica
                // Implementação opcional
              }}
            >
              {index + 1}
            </Chip>
          ))}
        </View>
      </View>

      {/* Lista de Questões */}
      <View style={styles.questionsSection}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Detalhamento por Questão
        </Text>
        
        {review.questions.map((question, index) => (
          <Card
            key={question.questionId}
            style={[
              styles.questionCard,
              question.isCorrect ? styles.correctCard : styles.wrongCard,
            ]}
          >
            <Card.Content>
              {/* Cabeçalho da Questão */}
              <View style={styles.questionHeader}>
                <View style={styles.questionNumberContainer}>
                  <Text variant="titleSmall" style={styles.questionNumber}>
                    Questão {index + 1}
                  </Text>
                  <Chip
                    mode="flat"
                    compact
                    style={[
                      styles.resultChip,
                      question.isCorrect 
                        ? { backgroundColor: colors.success } 
                        : { backgroundColor: colors.error }
                    ]}
                    textStyle={styles.resultChipText}
                  >
                    {question.isCorrect ? 'Acerto' : 'Erro'}
                  </Chip>
                </View>
                
                <Chip
                  mode="outlined"
                  compact
                  style={styles.questionTopicChip}
                  textStyle={styles.questionTopicText}
                >
                  {question.topic}
                </Chip>
              </View>

              {/* Enunciado */}
              <View style={styles.statementContainer}>
                <Text variant="bodyLarge" style={styles.statement}>
                  {question.statement}
                </Text>
              </View>

              <Divider style={styles.questionDivider} />

              {/* Alternativas */}
              <View style={styles.alternativesContainer}>
                <Text variant="labelMedium" style={styles.alternativesTitle}>
                  Alternativas:
                </Text>
                
                {question.alternatives.map((alt, altIndex) => {
                  const isCorrect = altIndex === question.correctIndex;
                  const isUserSelected = altIndex === question.userSelectedIndex;
                  const isWrongSelection = isUserSelected && !isCorrect;
                  
                  return (
                    <View
                      key={altIndex}
                      style={[
                        styles.alternativeContainer,
                        isCorrect && styles.correctAlternativeContainer,
                        isWrongSelection && styles.wrongAlternativeContainer,
                      ]}
                    >
                      <View style={styles.alternativeHeader}>
                        <View style={[
                          styles.alternativeMarker,
                          isCorrect && styles.correctMarker,
                          isWrongSelection && styles.wrongMarker,
                          !isCorrect && !isWrongSelection && styles.neutralMarker,
                        ]}>
                          <Text style={[
                            styles.markerText,
                            isCorrect && styles.correctMarkerText,
                            isWrongSelection && styles.wrongMarkerText,
                          ]}>
                            {String.fromCharCode(65 + altIndex)}
                          </Text>
                        </View>
                        
                        <View style={styles.alternativeLabels}>
                          {isCorrect && (
                            <Chip 
                              mode="flat" 
                              compact 
                              style={styles.correctLabel}
                              textStyle={styles.labelText}
                            >
                              Resposta Correta
                            </Chip>
                          )}
                          {isWrongSelection && (
                            <Chip 
                              mode="flat" 
                              compact 
                              style={styles.wrongLabel}
                              textStyle={styles.labelText}
                            >
                              Sua Escolha
                            </Chip>
                          )}
                        </View>
                      </View>
                      
                      <Text style={[
                        styles.alternativeText,
                        isCorrect && styles.correctAlternativeText,
                        isWrongSelection && styles.wrongAlternativeText,
                      ]}>
                        {alt}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          icon="repeat"
          onPress={() => navigation.navigate('StudentSimuladosScreen')}
          style={styles.newSimuladoButton}
        >
          Fazer Novo Simulado
        </Button>
        <Button
          mode="outlined"
          icon="history"
          onPress={() => navigation.navigate('SimuladoHistory')}
          style={styles.historyButton}
        >
          Ver Histórico
        </Button>
      </View>
    </ScrollView>
  );
};