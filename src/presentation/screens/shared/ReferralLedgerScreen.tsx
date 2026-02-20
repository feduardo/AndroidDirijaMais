// src/presentation/screens/shared/ReferralLedgerScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

import { colors } from '@/presentation/theme';

import { GetReferralLedgerUseCase } from '@/domain/use-cases/referral/GetReferralLedgerUseCase';
import { ReferralLedgerRepository } from '@/infrastructure/repositories/ReferralLedgerRepository';

type LedgerItem = {
  id: string;
  reward_type: string; // "credit"
  milestone_count?: number | null;
  amount: string; // "10.00"
  status: 'pending' | 'confirmed' | 'reversed' | string;
  created_at: string; // ISO
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);

const formatDateBR = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR');
};

export const ReferralLedgerScreen: React.FC = () => {
  const useCase = useMemo(() => {
    const repo = new ReferralLedgerRepository();
    return new GetReferralLedgerUseCase(repo);
  }, []);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [balance, setBalance] = useState<number>(0);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await useCase.execute();

      if (!res?.success) {
        throw new Error('Não foi possível carregar o extrato.');
      }

      const b = Number(res.balance);
      setBalance(Number.isFinite(b) ? b : 0);
      setLedger(Array.isArray(res.ledger) ? (res.ledger as LedgerItem[]) : []);
    } catch (e: any) {
      Alert.alert('Atenção', e?.message || 'Erro ao carregar extrato.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [useCase]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const renderItem = ({ item }: { item: LedgerItem }) => {
    const amountNum = Number(item.amount);

    const sign =
      item.status === 'reversed' || amountNum < 0
        ? '-'
        : '+';

    const amountLabel = Number.isFinite(amountNum)
      ? `${sign} ${formatMoney(Math.abs(amountNum))}`
      : item.amount;

    const title =
      item.milestone_count != null
        ? `Milestone ${item.milestone_count}`
        : 'Crédito';

    const statusLabel =
      item.status === 'confirmed'
        ? 'Confirmado'
        : item.status === 'pending'
          ? 'Pendente'
          : item.status === 'reversed'
            ? 'Estornado'
            : item.status;

    return (
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Text style={styles.itemTitle}>{title}</Text>
            <Text style={styles.itemMeta}>
              {formatDateBR(item.created_at)} • {statusLabel}
            </Text>
          </View>

          <Text style={styles.itemAmount}>{amountLabel}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>(carregando extrato)</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <Text style={styles.balanceValue}>{formatMoney(balance)}</Text>
      </View>

      <FlatList
        data={ledger}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.muted}>Sem lançamentos no extrato.</Text>
          </View>
        }
        contentContainerStyle={ledger.length ? styles.list : styles.listEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.background,
  },
  muted: { color: colors.textSecondary },

  balanceCard: {
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: { color: colors.textSecondary, marginBottom: 6 },
  balanceValue: { fontSize: 28, fontWeight: '700', color: colors.text },

  list: { paddingHorizontal: 16, paddingBottom: 16 },
  listEmpty: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16 },

  item: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  itemLeft: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemMeta: { marginTop: 4, color: colors.textSecondary, fontSize: 12 },
  itemAmount: { fontSize: 14, fontWeight: '700', color: colors.text },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
