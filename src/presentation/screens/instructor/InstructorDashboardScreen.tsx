import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '@/presentation/state/authStore';
import { colors } from '@/presentation/theme';
import InstructorRepository from '@/infrastructure/repositories/InstructorRepository';
import type { InstructorDashboardResponse } from '@/domain/entities/BookingAPI.types';

export const InstructorDashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const [dashboard, setDashboard] = useState<InstructorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setError(null);
      const data = await InstructorRepository.getDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Carregando dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color={colors.error}
        />
        <Text variant="titleMedium" style={styles.errorText}>
          {error}
        </Text>
        <Button mode="contained" onPress={loadDashboard} style={styles.retryButton}>
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
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.greeting}>
          Olá, {user?.full_name?.split(' ')[0]} 👋
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Pronto para suas aulas?
        </Text>
      </View>

      {/* KPIs Grid */}
      <View style={styles.kpisGrid}>
        {/* Aulas Hoje */}
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <MaterialCommunityIcons
              name="calendar-today"
              size={32}
              color={colors.primary}
            />
            <Text variant="headlineMedium" style={styles.kpiNumber}>
              {dashboard?.today_classes || 0}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              Aulas hoje
            </Text>
          </Card.Content>
        </Card>

        {/* Pendentes */}
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={32}
              color={colors.warning}
            />
            <Text variant="headlineMedium" style={styles.kpiNumber}>
              {dashboard?.pending || 0}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              Pendentes
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.kpisGrid}>
        {/* Confirmadas */}
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={32}
              color={colors.success}
            />
            <Text variant="headlineMedium" style={styles.kpiNumber}>
              {dashboard?.accepted || 0}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              Confirmadas
            </Text>
          </Card.Content>
        </Card>

        {/* Total */}
        <Card style={styles.kpiCard}>
          <Card.Content style={styles.kpiContent}>
            <MaterialCommunityIcons
              name="chart-line"
              size={32}
              color={colors.secondary}
            />
            <Text variant="headlineMedium" style={styles.kpiNumber}>
              {dashboard?.total_bookings || 0}
            </Text>
            <Text variant="bodySmall" style={styles.kpiLabel}>
              Total de aulas
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Card: Em Andamento */}
      {dashboard && dashboard.in_progress > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="car"
                size={24}
                color={colors.primary}
              />
              <Text variant="titleMedium" style={styles.cardTitle}>
                Aula em Andamento
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.inProgressText}>
              Você tem {dashboard.in_progress} aula
              {dashboard.in_progress > 1 ? 's' : ''} em andamento
            </Text>
            <Button
              mode="contained"
              style={styles.cardButton}
              onPress={() => navigation.navigate('InstructorBookings')}
            >
              Ver Aulas
            </Button>
          </Card.Content>
        </Card>
      )}


      {/* Ações Rápidas */}
      <View style={styles.actionsContainer}>
        <Text variant="titleMedium" style={styles.actionsTitle}>
          Ações Rápidas
        </Text>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('InstructorBookings')}
        >
          <View style={styles.actionIconBadge}>
            <MaterialCommunityIcons
              name="inbox-arrow-down"
              size={20}
              color={colors.primary}
            />
            {dashboard && dashboard.pending > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{dashboard.pending}</Text>
              </View>
            )}
          </View>
          <Text variant="bodyMedium" style={styles.actionText}>
            Solicitações de Aula
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('InstructorMain', { screen: 'InstructorAgenda' })}
        >
          <MaterialCommunityIcons
            name="calendar-month"
            size={20}
            color={colors.primary}
          />
          <Text variant="bodyMedium" style={styles.actionText}>
            Gerenciar Agenda
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => navigation.navigate('InstructorProfile')}
        >
          <MaterialCommunityIcons
            name="account-badge-outline"
            size={20}
            color={colors.primary}
          />
          <Text variant="bodyMedium" style={styles.actionText}>
            Meu Perfil
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Botão Sair */}
      <Button
        mode="text"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={colors.error}
      >
        Sair
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },

  errorText: {
    color: colors.error,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },

  retryButton: {
    minWidth: 200,
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

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 14,
  },

  kpisGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },

  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  kpiContent: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  kpiNumber: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
    letterSpacing: -0.5,
  },

  kpiLabel: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17,
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardTitle: {
    marginLeft: 8,
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },

  inProgressText: {
    color: colors.text,
    marginBottom: 12,
  },

  cardButton: {
    marginTop: 8,
    borderRadius: 12,
  },

  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  actionsTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 15,
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  actionIconBadge: {
    position: 'relative',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  badgeText: {
    color: colors.onPrimary,
    fontSize: 11,
    fontWeight: '700',
  },

  actionText: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 15,
  },

  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});