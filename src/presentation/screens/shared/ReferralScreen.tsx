// src/presentation/screens/shared/ReferralScreen.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { useReferral } from '@/presentation/hooks/useReferral';
import { colors } from '@/presentation/theme';
import { styles } from './ReferralScreen.styles';
import type { ReferralItem } from '@/domain/entities/Referral.entity';
import { TextInput, Modal, Portal } from 'react-native-paper';

type ReferralNav = {
  navigate: (screen: string) => void;
};

const maskMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);

const formatDateBR = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const ReferralScreen: React.FC = () => {
  const navigation = useNavigation<ReferralNav>();

  const {
    loading,
    refreshing,
    error,
    campaign,
    dashboard,
    load,
    refresh,
    applyReferralCode,
    clearError,
  } = useReferral();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (error) {
      Alert.alert('Atenção', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  const progress = useMemo(() => {
    const next = dashboard?.next_milestone;
    if (!next) return { pct: 0, label: 'Sem metas disponíveis', remaining: 0 };

    const pct =
      next.count > 0 ? Math.min(100, Math.round((next.progress / next.count) * 100)) : 0;

    return {
      pct,
      label: `${next.progress} de ${next.count} indicações válidas`,
      remaining: next.remaining ?? 0,
    };
  }, [dashboard]);

  const milestones = useMemo(() => {
    if (!campaign?.milestones) return [];
    
    const validCount = dashboard?.valid_referrals ?? 0;
    
    return campaign.milestones.map(m => {
      const isCompleted = validCount >= m.count;
      const isCurrent = 
        !isCompleted && 
        (dashboard?.next_milestone?.count === m.count);
      
      return {
        ...m,
        isCompleted,
        isCurrent,
      };
    });
  }, [campaign, dashboard]);

  const onShareCode = async () => {
    const code = dashboard?.code;
    if (!code) return;
    
    try {
      const shareMessage = [
        '🎁 Ganhe 10% de desconto na sua primeira aula!',
        '',
        `Use meu código: ${code}`,
        '',
        'Baixe o app DirijaCerto e comece a dirigir!',
        'https://dirijacerto.com.br/',
      ].join('\n');

      await Share.share({ message: shareMessage });
    } catch (err) {
      console.log('Erro ao compartilhar:', err);
    }
  };

  const onOpenLedger = () => {
    navigation.navigate('ReferralLedgerScreen');
  };

  if (loading && !dashboard && !campaign) {
    return (
      <View style={styles.center}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const referrals: ReferralItem[] = dashboard?.referrals ?? [];

  const onApplyCode = async () => {
    if (!codeInput.trim()) {
      Alert.alert('Atenção', 'Digite um código válido');
      return;
    }

    setApplyingCode(true);
    
    try {
      const result = await applyReferralCode(codeInput.toUpperCase());
      
      console.log('✅ Código aplicado com sucesso:', result);
      
      Alert.alert(
        'Sucesso! 🎉',
        'Código aplicado! Você ganhou 10% de desconto na primeira aula.',
        [{ text: 'OK', onPress: () => {
          setShowApplyModal(false);
          setCodeInput('');
          refresh();
        }}]
      );
    } catch (err: any) {
      console.log('❌ ERRO COMPLETO:', JSON.stringify(err, null, 2));
      console.log('❌ err.response:', err.response);
      console.log('❌ err.response?.data:', err.response?.data);
      console.log('❌ err.response?.data?.detail:', err.response?.data?.detail);
      
      const errorMessage = err.response?.data?.detail || err.message || 'Não foi possível aplicar o código';
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setApplyingCode(false);
    }
  };


  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
      contentContainerStyle={styles.content}
    >
      {/* BLOCO 1: Código */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Seu Código de Indicação</Text>
          <TouchableOpacity 
            onPress={onShareCode} 
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Compartilhar código"
          >
            <Icon name="share-variant" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{dashboard?.code ?? '—'}</Text>
        </View>

        <Text style={styles.helperText}>
          Compartilhe este código. Quem usar ganha{' '}
          <Text style={{ fontWeight: '700' }}>10% de desconto</Text> na primeira aula!
        </Text>

      {/* BLOCO 1.5: Aplicar Código Recebido */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tenho um código</Text>
        <Text style={styles.helperText}>
          Recebeu um código de indicação? Digite aqui para ganhar desconto!
        </Text>
        
        <TouchableOpacity
          onPress={() => setShowApplyModal(true)}
          style={styles.applyCodeButton}
          accessibilityRole="button"
        >
          <Icon name="ticket-percent" size={20} color="#fff" />
          <Text style={styles.applyCodeButtonText}>Aplicar Código</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para aplicar código */}
      <Portal>
        <Modal
          visible={showApplyModal}
          onDismiss={() => !applyingCode && setShowApplyModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Aplicar Código</Text>
            <TouchableOpacity
              onPress={() => setShowApplyModal(false)}
              disabled={applyingCode}
            >
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            Digite o código que você recebeu para ganhar 10% de desconto na primeira aula.
          </Text>

          <TextInput
            mode="outlined"
            label="Código de indicação"
            value={codeInput}
            onChangeText={setCodeInput}
            autoCapitalize="characters"
            maxLength={20}
            disabled={applyingCode}
            style={styles.modalInput}
          />

          <TouchableOpacity
            onPress={onApplyCode}
            disabled={applyingCode || !codeInput.trim()}
            style={[
              styles.modalButton,
              (!codeInput.trim() || applyingCode) && styles.modalButtonDisabled
            ]}
          >
            {applyingCode ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modalButtonText}>Aplicar</Text>
            )}
          </TouchableOpacity>
        </Modal>
      </Portal>

      </View>

      {/* BLOCO 2: Progresso e Milestones */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Suas Recompensas</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💰 A cada etapa atingida, você ganha créditos para usar em aulas futuras!
          </Text>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <View 
              style={[styles.progressBarFill, { width: `${progress.pct}%` }]} 
            />
          </View>

          <View style={styles.progressStats}>
            <Text style={styles.muted}>{progress.label}</Text>
            <Text style={styles.muted}>{progress.pct}%</Text>
          </View>

          {typeof progress.remaining === 'number' && progress.remaining > 0 && (
            <Text style={styles.mutedSmall}>
              Faltam {progress.remaining} para a próxima recompensa
            </Text>
          )}
        </View>

        {/* Lista de Milestones */}
        <View style={styles.milestonesContainer}>
          {milestones.map(m => (
            <View
              key={m.count}
              style={[
                styles.milestoneItem,
                m.isCompleted && styles.milestoneItemActive,
                m.isCurrent && styles.milestoneItemCurrent,
              ]}
            >
              <View style={styles.milestoneLeft}>
              <Icon
                name={
                  m.isCompleted
                    ? 'trophy'
                    : m.isCurrent
                    ? 'trophy-outline'
                    : 'trophy-outline'
                }
                size={20}
                color={
                  m.isCompleted
                    ? colors.success
                    : m.isCurrent
                    ? '#FF9800'
                    : colors.textSecondary
                }
              />
                <Text
                  style={[
                    styles.milestoneText,
                    m.isCompleted && styles.milestoneTextCompleted,
                  ]}
                >
                  {m.count} indicações
                </Text>
              </View>

              <Text
                style={[
                  styles.milestoneReward,
                  m.isCompleted && styles.milestoneRewardCompleted,
                ]}
              >
                {maskMoney(m.reward_amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Saldo */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceLeft}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={styles.balanceValue}>
              {maskMoney(dashboard?.balance ?? 0)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={onOpenLedger}
            style={styles.linkBtn}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Ver extrato</Text>
            <Icon name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BLOCO 3: Lista de Indicações */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Suas Indicações</Text>
          <Text style={styles.muted}>
            {dashboard 
              ? `${dashboard.valid_referrals}/${dashboard.total_referrals} válidas` 
              : '—'}
          </Text>
        </View>

        {referrals.length ? (
          referrals.map((item: ReferralItem) => (
            <View 
              key={`${item.applied_at}-${item.referred_email}`} 
              style={styles.listItem}
            >
              <View style={styles.listLeft}>
                <Icon
                  name={
                    item.has_completed_lesson 
                      ? 'check-circle' 
                      : 'clock-outline'
                  }
                  size={20}
                  color={
                    item.has_completed_lesson 
                      ? colors.success 
                      : colors.warning
                  }
                />
                <View style={styles.listText}>
                  <Text style={styles.listEmail}>
                    {item.referred_email}
                  </Text>
                  <Text style={styles.listDate}>
                    {formatDateBR(item.applied_at)}
                  </Text>
                </View>
              </View>

              <View 
                style={[
                  styles.badge,
                  item.has_completed_lesson && { 
                    backgroundColor: '#E8F5E9' 
                  }
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.has_completed_lesson && 
                      styles.badgeTextCompleted,
                  ]}
                >
                  {item.has_completed_lesson ? 'Válida' : 'Pendente'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <Icon 
              name="account-multiple-outline" 
              size={48} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyText}>
              Nenhuma indicação ainda
            </Text>
            <Text style={styles.mutedSmall}>
              Compartilhe seu código para começar!
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.mutedSmall}>
          📌 Indicação válida = pessoa que usou seu código e completou pelo menos 1 aula
        </Text>
        {campaign?.name && (
          <Text style={styles.mutedSmall}>
            Campanha: {campaign.name}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};