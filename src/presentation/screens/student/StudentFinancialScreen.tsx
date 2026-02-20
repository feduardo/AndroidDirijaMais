import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import httpClient from '@/infrastructure/http/client';

interface PaymentItem {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  payment_method_type: string | null;
  provider: string;
  created_at: string;
  scheduled_date: string | null;
  instructor_name: string | null;
  duration_minutes: number | null;
}

interface StatementResponse {
  total_paid: number;
  total_pending: number;
  total_refunded: number;
  payments: PaymentItem[];
}

export const StudentFinancialScreen = () => {
  const [statement, setStatement] = useState<StatementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatement = async () => {
    try {
      setError(null);
      const response = await httpClient.get<StatementResponse>(
        '/api/v1/students/financial/statement'
      );
      setStatement(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar extrato:', err);
      setError('Não foi possível carregar o extrato. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatement();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStatement();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'succeeded':
        return colors.success;
      case 'pending':
      case 'processing':
        return colors.warning;
      case 'failed':
        return colors.error;
      case 'refunded':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'succeeded':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'succeeded':
        return 'check-circle';
      case 'pending':
      case 'processing':
        return 'clock-outline';
      case 'failed':
        return 'close-circle';
      case 'refunded':
        return 'undo-variant';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderPaymentCard = ({ item }: { item: PaymentItem }) => {
    return (
      <Card style={styles.card} mode="elevated" elevation={2}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.amountContainer}>
              <Text variant="titleLarge" style={styles.amount}>
                R$ {Number(item.amount).toFixed(2)}
              </Text>
              <Text variant="bodySmall" style={styles.date}>
                {formatDate(item.created_at)}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(item.status)}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={getStatusIcon(item.status)}
                size={14}
                color={getStatusColor(item.status)}
              />
              <Text
                variant="labelSmall"
                style={[styles.statusText, { color: getStatusColor(item.status) }]}
              >
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>

          {item.instructor_name && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {item.instructor_name}
              </Text>
            </View>
          )}

          {item.scheduled_date && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={16}
                color={colors.textSecondary}
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {formatDate(item.scheduled_date)}
                {item.duration_minutes && ` • ${item.duration_minutes} min`}
              </Text>
            </View>
          )}

          {item.payment_method_type && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text variant="bodyMedium" style={styles.detailText}>
                {item.payment_method_type === 'credit_card' ? 'Cartão de Crédito' : item.payment_method_type}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="headlineSmall" style={styles.title}>
        Extrato Financeiro
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Histórico de pagamentos
      </Text>

      {statement && (
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <Card.Content>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
                  <Text variant="labelSmall" style={styles.summaryLabel}>
                    Pago
                  </Text>
                  <Text variant="titleMedium" style={styles.summaryValue}>
                    R$ {Number(statement.total_paid).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color={colors.warning} />
                  <Text variant="labelSmall" style={styles.summaryLabel}>
                    Pendente
                  </Text>
                  <Text variant="titleMedium" style={styles.summaryValue}>
                    R$ {Number(statement.total_pending).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryItem}>
                  <MaterialCommunityIcons name="undo-variant" size={24} color={colors.info} />
                  <Text variant="labelSmall" style={styles.summaryLabel}>
                    Reembolsado
                  </Text>
                  <Text variant="titleMedium" style={styles.summaryValue}>
                    R$ {Number(statement.total_refunded).toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      <Text variant="titleSmall" style={styles.listTitle}>
        Histórico de Transações
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="wallet-outline" size={80} color={colors.border} />
      <Text variant="titleLarge" style={styles.emptyTitle}>
        Nenhum pagamento
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Você ainda não realizou nenhum pagamento.
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Carregando extrato...
        </Text>
      </View>
    );
  }

  if (error && !statement) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error} />
        <Text variant="titleMedium" style={styles.errorTitle}>
          Ops! Algo deu errado
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={statement?.payments || []}
        keyExtractor={item => item.id}
        renderItem={renderPaymentCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
    padding: 24,
    backgroundColor: colors.background,
  },
  errorTitle: {
    marginTop: 16,
    color: colors.text,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  summaryLabel: {
    marginTop: 8,
    color: colors.textSecondary,
  },
  summaryValue: {
    marginTop: 4,
    color: colors.text,
    fontWeight: '600',
  },
  listTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  amountContainer: {
    flex: 1,
  },
  amount: {
    color: colors.text,
    fontWeight: '700',
  },
  date: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  detailText: {
    color: colors.textSecondary,
    flex: 1,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    color: colors.text,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 8,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});