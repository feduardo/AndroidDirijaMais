import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/presentation/state/authStore';
import { colors } from '@/presentation/theme';
import { journeyRepository } from '@/infrastructure/repositories/JourneyRepository';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StudentStackParamList } from '@/presentation/navigation/StudentStack';
import httpClient from '@/infrastructure/http/client';


type DashboardScreenNavigationProp = NativeStackNavigationProp <
  StudentStackParamList,
  'Dashboard'
>;

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp;
}

export const DashboardScreen = ({ navigation }: DashboardScreenProps) => {
  const { user } = useAuthStore();
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.full_name?.split(' ')[0] || 'Aluno';

  const loadJourneyProgress = async () => {
    try {
      const progress = await journeyRepository.getProgress();
      setJourneyProgress(progress.progress_percentage);
    } catch (error) {
      console.log('Erro ao carregar progresso:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const [reservedCredits, setReservedCredits] = useState(0);

  const loadDashboard = async () => {
    try {
      const res = await httpClient.get('/api/v1/students/dashboard');
      setReservedCredits(res.data?.reserved_credits ?? 0);
    } catch (error) {
      console.log('Erro ao carregar dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJourneyProgress();
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadJourneyProgress();
    loadDashboard();
  };


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>
          Olá, {firstName} 👋
        </Text>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Ações Rápidas
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('InstructorsList')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="calendar-plus" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Agendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('StudentSimulados')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '15' }]}>
              <MaterialCommunityIcons name="file-document-edit" size={24} color={colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Simulados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('StudentBookings')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="history" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('StudentMessages')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="message-text" size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Mensagens</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Minha Jornada */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Minha Jornada
        </Text>
        <Card style={styles.journeyCard}>
          <Card.Content>
            <View style={styles.journeyHeader}>
              <View style={styles.journeyInfo}>
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={28}
                  color={colors.secondary}
                />
                <View style={styles.journeyTextContainer}>
                  <Text variant="titleMedium" style={styles.journeyTitle}>
                    Rumo à Habilitação
                  </Text>
                  <Text variant="bodySmall" style={styles.journeySubtitle}>
                    Acompanhe seu progresso
                  </Text>
                </View>
              </View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressPercentage}>{journeyProgress}%</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${journeyProgress}%` },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.journeyButton}
              onPress={() => navigation.navigate('Journey')}
            >
              <Text style={styles.journeyButtonText}>Acessar Jornada</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>

      {/* Pronto para sua próxima aula? */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Pronto para sua próxima aula?
        </Text>
        <Card style={styles.nextLessonCard}>
          <Card.Content>
            <View style={styles.nextLessonHeader}>
              <MaterialCommunityIcons name="calendar-clock" size={28} color={colors.primary} />
              <Text variant="titleMedium" style={styles.nextLessonTitle}>
                #PartiuAgendar!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() => navigation.navigate('InstructorsList')}
            >
              <MaterialCommunityIcons name="calendar-plus" size={20} color="#FFFFFF" />
              <Text style={styles.scheduleButtonText}>Agendar Aula</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>

      {/* Estatísticas Grid */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="wallet" size={28} color={colors.success} />
              <Text style={styles.statNumber}>
                {reservedCredits.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Text>
              <Text style={styles.statLabel}>Créditos reservados</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="school" size={28} color={colors.primary} />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Aulas Realizadas</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons
                name="file-document-edit"
                size={28}
                color={colors.accent}
              />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Simulados</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="calendar-check" size={28} color={colors.warning} />
              <Text style={styles.statNumber}>--</Text>
              <Text style={styles.statLabel}>Prova Teórica</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={[styles.statCard, styles.fullWidthCard]}>
            <Card.Content style={styles.statContent}>
              <MaterialCommunityIcons name="car" size={28} color={colors.secondary} />
              <Text style={styles.statNumber}>--</Text>
              <Text style={styles.statLabel}>Prova Prática</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  greeting: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 1,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  journeyCard: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  journeyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  journeyTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  journeyTitle: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 15,
  },
  journeySubtitle: {
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  journeyButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  journeyButtonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  nextLessonCard: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  nextLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  nextLessonTitle: {
    marginLeft: 12,
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    color: colors.textSecondary,
    marginBottom: 16,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: colors.shadow.button,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  scheduleButtonText: {
    color: colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fullWidthCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 18,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
});