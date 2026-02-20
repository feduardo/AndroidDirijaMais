import React, { useState, useEffect, useCallback } from 'react';
import { 
  ScrollView, 
  View, 
  RefreshControl, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import {
  Button,
  Card,
  Chip,
  Dialog,
  Portal,
  Text,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PayoutRepository, {
  BalanceResponse,
  PayoutCardResponse,
} from '@/infrastructure/repositories/PayoutRepository';
import WithdrawalMethodRepository, {
  WithdrawalMethodResponse,
} from '@/infrastructure/repositories/WithdrawalMethodRepository';
import { colors } from '@/presentation/theme';
import { styles } from '././InstructorFinancialScreen.styles';

export default function InstructorFinancialScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState<WithdrawalMethodResponse | null>(null);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [payouts, setPayouts] = useState<PayoutCardResponse[]>([]);
  const [anticipationModal, setAnticipationModal] = useState(false);
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutCardResponse | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const method = await WithdrawalMethodRepository.getCurrentMethod();
      setWithdrawalMethod(method);

      if (method && method.status === 'validated') {
        const [balanceData, payoutsData] = await Promise.all([
          PayoutRepository.getBalance(),
          PayoutRepository.listPayouts(),
        ]);
        setBalance(balanceData);
        setPayouts(payoutsData);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados financeiros:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados financeiros.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAnticipate = async () => {
    if (!selectedPayout) return;

    try {
      setActionLoading(true);
      await PayoutRepository.requestAnticipation(selectedPayout.id);
      setAnticipationModal(false);
      Alert.alert('Sucesso', 'Antecipação solicitada! Valor atualizado.');
      loadData();
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err?.response?.data?.detail || 'Não foi possível antecipar. Tente novamente.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedPayout) return;

    try {
      setActionLoading(true);
      const result = await PayoutRepository.requestWithdrawal(selectedPayout.id);
      setWithdrawalModal(false);
      Alert.alert('Sucesso', 'Saque solicitado! Será processado em até 2 dias úteis.');
      loadData();
    } catch (err: any) {
      Alert.alert(
        'Erro',
        err?.response?.data?.detail || 'Não foi possível solicitar saque. Tente novamente.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      waiting: colors.warning,
      available: colors.success,
      pending_transfer: colors.accent,
      paid: colors.disabled,
      blocked: colors.error,
    };
    return statusColors[status] || colors.textSecondary;
  };

  const getStatusLabel = (status: string): string => {
    const statusLabels: Record<string, string> = {
      waiting: 'Aguardando',
      available: 'Disponível',
      pending_transfer: 'Processando',
      paid: 'Pago',
      blocked: 'Bloqueado',
    };
    return statusLabels[status] || status;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysUntil = (dateString: string): number => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Carregando dados financeiros...</Text>
    </View>
  );

  const renderNoPix = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.emptyCard}>
        <Card.Content style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="key-variant" size={64} color={colors.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Configure sua chave Pix
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Para receber seus pagamentos, você precisa cadastrar uma chave Pix.
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('InstructorPixRegistration')}
            style={styles.emptyButton}
            contentStyle={styles.buttonContent}
          >
            Cadastrar Chave Pix
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderPendingPix = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.emptyCard}>
        <Card.Content style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="clock-outline" size={64} color={colors.primary} />
          </View>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Chave Pix em validação
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Sua chave Pix está sendo validada pela nossa equipe. Aguarde até 24h.
          </Text>
          <Chip 
            icon="key-variant" 
            style={styles.pixChip}
            textStyle={styles.pixChipText}
          >
            {withdrawalMethod?.pix_key}
          </Chip>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderBalanceCards = () => (
    <View style={styles.balanceContainer}>
      <Card style={[styles.balanceCard, styles.availableCard]}>
        <Card.Content>
          <View style={styles.balanceHeader}>
            <View style={[styles.balanceIcon, { backgroundColor: colors.success + '20' }]}>
              <MaterialCommunityIcons name="cash-check" size={28} color={colors.success} />
            </View>
            <Text variant="labelMedium" style={styles.balanceLabel}>
              Disponível para Saque
            </Text>
          </View>
          <Text variant="headlineMedium" style={styles.availableBalance}>
            {formatCurrency(balance?.available_balance || 0)}
          </Text>
          <Text variant="bodySmall" style={styles.balanceCount}>
            {balance?.total_available_payouts || 0} disponíveis
          </Text>
        </Card.Content>
      </Card>

      <Card style={[styles.balanceCard, styles.waitingCard]}>
        <Card.Content>
          <View style={styles.balanceHeader}>
            <View style={[styles.balanceIcon, { backgroundColor: colors.warning + '20' }]}>
              <MaterialCommunityIcons name="clock-outline" size={28} color={colors.warning} />
            </View>
            <Text variant="labelMedium" style={styles.balanceLabel}>
              Aguardando Liberação
            </Text>
          </View>
          <Text variant="headlineMedium" style={styles.waitingBalance}>
            {formatCurrency(balance?.waiting_balance || 0)}
          </Text>
          <Text variant="bodySmall" style={styles.balanceCount}>
            {balance?.total_waiting_payouts || 0} dentro do prazo
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <View>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Suas Aulas
        </Text>
        <Text variant="bodySmall" style={styles.sectionSubtitle}>
          Seus recebimentos por aula
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('InstructorPixRegistration')}
        style={styles.pixButton}
      >
        <MaterialCommunityIcons name="key-variant" size={12} color={colors.primary} />
        <Text variant="labelMedium" style={styles.pixButtonText}>
          Configurar Pix
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderPayoutCard = (payout: PayoutCardResponse) => {
    const daysUntil = getDaysUntil(payout.available_at);
    const isAnticipable = payout.status === 'waiting' && !payout.is_anticipation;
    const isWithdrawable = payout.status === 'available';

    return (
      <Card key={payout.id} style={styles.payoutCard}>
        <Card.Content>
          <View style={styles.payoutHeader}>
            <View style={styles.payoutStudent}>
              <View style={styles.studentAvatar}>
                <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
              </View>
              <View style={styles.studentInfo}>
                <Text variant="titleSmall" style={styles.studentName}>
                  {payout.student_name}
                </Text>
                <Text variant="bodySmall" style={styles.payoutDate}>
                  {formatDate(payout.scheduled_date)}
                </Text>
              </View>
            </View>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(payout.status) + '15' }]}
              textStyle={[styles.statusChipText, { color: getStatusColor(payout.status) }]}
            >
              {getStatusLabel(payout.status)}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.payoutAmounts}>
            <View style={styles.amountRow}>
              <View style={styles.amountLabelContainer}>
                <MaterialCommunityIcons name="cash" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.amountLabel}>Valor bruto:</Text>
              </View>
              <Text variant="bodyMedium">{formatCurrency(payout.gross_amount)}</Text>
            </View>
            
            <View style={styles.amountRow}>
              <View style={styles.amountLabelContainer}>
                <MaterialCommunityIcons name="percent" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.amountLabel}>
                  Taxa ({payout.fee_percentage}%):
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.feeText}>
                -{formatCurrency(payout.platform_fee)}
              </Text>
            </View>
            
            <Divider style={styles.amountDivider} />
            
            <View style={[styles.amountRow, styles.netAmountRow]}>
              <View style={styles.amountLabelContainer}>
                <MaterialCommunityIcons name="wallet" size={20} color={colors.primary} />
                <Text variant="titleSmall" style={styles.netAmountLabel}>Você recebe:</Text>
              </View>
              <Text variant="titleMedium" style={styles.netAmount}>
                {formatCurrency(payout.net_amount)}
              </Text>
            </View>
          </View>

          {payout.status === 'waiting' && (
            <View style={styles.availabilityContainer}>
              <MaterialCommunityIcons name="calendar-clock" size={16} color={colors.warning} />
              <Text variant="bodySmall" style={styles.availableIn}>
                Disponível em {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}
              </Text>
            </View>
          )}

          <Divider style={styles.divider} />

          <View style={styles.payoutActions}>
            {isAnticipable && (
              <Button
                mode="outlined"
                onPress={() => {
                  setSelectedPayout(payout);
                  setAnticipationModal(true);
                }}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="rocket-launch-outline"
              >
                Antecipar para D+14
              </Button>
            )}

            {isWithdrawable && (
              <Button
                mode="contained"
                onPress={() => {
                  setSelectedPayout(payout);
                  setWithdrawalModal(true);
                }}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                icon="bank-transfer-out"
              >
                Solicitar Saque
              </Button>
            )}

            {payout.is_anticipation && payout.status === 'waiting' && (
              <View style={styles.anticipatedBadge}>
                <MaterialCommunityIcons name="clock-fast" size={16} color={colors.accent} />
                <Text variant="labelSmall" style={styles.anticipatedText}>
                  Antecipado
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyPayouts = () => (
    <Card style={styles.emptyCard}>
      <Card.Content style={styles.emptyState}>
        <MaterialCommunityIcons name="calendar-blank" size={48} color={colors.border} />
        <Text variant="bodyMedium" style={styles.emptyText}>
          Nenhuma aula registrada ainda.
        </Text>
      </Card.Content>
    </Card>
  );

  const renderAnticipationModal = () => (
    <Portal>
      <Dialog 
        visible={anticipationModal} 
        onDismiss={() => setAnticipationModal(false)}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.dialogTitle}>Antecipar Recebimento</Dialog.Title>
        <Dialog.Content>
          {selectedPayout && (
            <>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons name="rocket-launch" size={32} color={colors.primary} />
                <Text variant="bodyMedium" style={styles.modalDescription}>
                  Você receberá em 14 dias ao invés de 30 dias.
                </Text>
              </View>

              <View style={styles.modalAmounts}>
                <View style={styles.modalRow}>
                  <Text variant="bodySmall" style={styles.modalLabel}>Valor atual:</Text>
                  <Text variant="bodyMedium">{formatCurrency(selectedPayout.net_amount)}</Text>
                </View>
                
                <View style={styles.modalRow}>
                  <Text variant="bodySmall" style={styles.modalLabel}>Nova taxa:</Text>
                  <View style={styles.feeBadge}>
                    <Text variant="labelSmall" style={styles.feeBadgeText}>
                      {selectedPayout.fee_percentage + 3}%
                    </Text>
                  </View>
                </View>
                
                <Divider style={styles.modalDivider} />
                
                <View style={styles.modalRow}>
                  <Text variant="titleSmall" style={styles.modalFinalLabel}>Você receberá:</Text>
                  <Text variant="headlineSmall" style={styles.modalFinalAmount}>
                    {formatCurrency(
                      selectedPayout.gross_amount * (1 - (selectedPayout.fee_percentage + 3) / 100)
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.modalNote}>
                <MaterialCommunityIcons name="information-outline" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.modalNoteText}>
                  Taxa adicional de 3% para antecipação.
                </Text>
              </View>
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button 
            onPress={() => setAnticipationModal(false)} 
            disabled={actionLoading}
            style={styles.dialogCancel}
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={handleAnticipate} 
            loading={actionLoading}
            style={styles.dialogConfirm}
          >
            Confirmar Antecipação
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderWithdrawalModal = () => (
    <Portal>
      <Dialog 
        visible={withdrawalModal} 
        onDismiss={() => setWithdrawalModal(false)}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.dialogTitle}>Solicitar Saque</Dialog.Title>
        <Dialog.Content>
          {selectedPayout && withdrawalMethod && (
            <>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons name="bank-transfer" size={32} color={colors.primary} />
                <Text variant="bodyMedium" style={styles.modalDescription}>
                  Confirme os dados do saque:
                </Text>
              </View>

              <View style={styles.modalAmounts}>
                <View style={styles.modalRow}>
                  <Text variant="bodySmall" style={styles.modalLabel}>Valor:</Text>
                  <Text variant="titleMedium" style={styles.modalValue}>
                    {formatCurrency(selectedPayout.net_amount)}
                  </Text>
                </View>
                
                <View style={styles.modalRow}>
                  <View style={styles.pixInfo}>
                    <MaterialCommunityIcons name="key-variant" size={16} color={colors.primary} />
                    <View style={styles.pixDetails}>
                      <Text variant="bodySmall" style={styles.modalLabel}>Destino:</Text>
                      <Text variant="bodyMedium">Pix (***{withdrawalMethod.pix_key.slice(-3)})</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.modalNote}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
                <Text variant="bodySmall" style={styles.modalNoteText}>
                  O saque será processado em até 2 dias úteis.
                </Text>
              </View>
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button 
            onPress={() => setWithdrawalModal(false)} 
            disabled={actionLoading}
            style={styles.dialogCancel}
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={handleWithdraw} 
            loading={actionLoading}
            style={styles.dialogConfirm}
          >
            Confirmar Saque
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  if (loading) {
    return renderLoading();
  }

  if (!withdrawalMethod) {
    return renderNoPix();
  }

  if (withdrawalMethod.status === 'pending') {
    return renderPendingPix();
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[colors.primary]} 
            tintColor={colors.primary}
          />
        }
      >
        {renderBalanceCards()}
        {renderSectionHeader()}
        
        {payouts.length === 0 ? 
          renderEmptyPayouts() : 
          payouts.map(payout => renderPayoutCard(payout))
        }
      </ScrollView>

      {renderAnticipationModal()}
      {renderWithdrawalModal()}
    </>
  );
}