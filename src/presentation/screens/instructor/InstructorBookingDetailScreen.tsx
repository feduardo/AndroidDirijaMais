import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Portal, Modal, TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import InstructorRepository from '@/infrastructure/repositories/InstructorRepository';
import { BookingAPIResponse, BookingStatus } from '@/domain/entities/BookingAPI.types';
import { fromUTC, formatLocalDate, formatLocalTime } from '@/utils/timezone';
import {
  RejectReasonCode,
  REJECT_REASON_LABELS,
  BookingRejectRequest,
  InstructorCancelReasonCode,             
  INSTRUCTOR_CANCEL_REASON_LABELS,        
  InstructorCancelRequest,               
} from '@/domain/entities/BookingReason.types';

const isRefunded = (b: BookingAPIResponse | null) => b?.payment_status === 'refunded';


const paymentBadgeConfig = {
  succeeded: { label: '✓ Pago', color: colors.success },
  processing: { label: '⏳ Processando', color: colors.warning },
  failed: { label: '✗ Falhou', color: colors.error },
  none: { label: 'Sem pagamento', color: colors.disabled },
} as const;


interface RouteParams {
  bookingId: string;
}

export const InstructorBookingDetailScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params as RouteParams;

  const [booking, setBooking] = useState<BookingAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modais
  const [showStartModal, setShowStartModal] = useState(false);
  const [startCode, setStartCode] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  

  // Modal de rejeição
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonCode, setRejectReasonCode] = useState<RejectReasonCode | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('');

  // Modal de cancelamento
  const [cancelReasonCode, setCancelReasonCode] = useState<InstructorCancelReasonCode | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState('');


  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    try {
      setError(null);

      const data = await InstructorRepository.getBookingById(bookingId);

      console.log('BOOKING RAW:', data);
      console.log('BOOKING LOCATION:', JSON.stringify(data.location));

      setBooking(data);
    } catch (err: any) {
      console.error('Erro ao carregar booking:', err);
      setError(err.response?.data?.detail || 'Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  };


  
  const handleAccept = () => {
    if (booking?.payment_status === 'refunded') {
      Alert.alert('Pagamento reembolsado', 'Esta solicitação foi reembolsada e não pode ser aceita.');
      return;
    }

    if (!booking?.can_accept) {
      Alert.alert('Aguardando pagamento', 'Aguardando confirmação de pagamento do aluno');
      return;
    }

    Alert.alert(
      'Aceitar Solicitação',
      'Confirma que deseja aceitar esta aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: async () => {
            try {
              setActionLoading(true);
              await InstructorRepository.acceptBooking(bookingId);
              Alert.alert('Sucesso', 'Aula confirmada!');
              loadBooking();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.detail || 'Erro ao aceitar');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!rejectReasonCode) {
      Alert.alert('Erro', 'Selecione um motivo');
      return;
    }

    if (rejectReasonCode === RejectReasonCode.OTHER && !rejectReasonText.trim()) {
      Alert.alert('Erro', 'Informe o motivo para "Outro"');
      return;
    }

    if (rejectReasonText.length > 140) {
      Alert.alert('Erro', 'Motivo muito longo (máximo 140 caracteres)');
      return;
    }

    try {
      setActionLoading(true);

      const payload: BookingRejectRequest = {
        reason_code: rejectReasonCode,
        reason_text: rejectReasonCode === RejectReasonCode.OTHER ? rejectReasonText : undefined,
      };

      await InstructorRepository.rejectBooking(bookingId, payload);
      
      setShowRejectModal(false);
      setRejectReasonCode(null);
      setRejectReasonText('');
      
      Alert.alert('Recusada', 'Solicitação recusada.');
      navigation.goBack();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erro ao recusar';
      
      if (err.response?.status === 400 && errorMsg.includes('reason_code')) {
        Alert.alert('Erro', 'Motivo inválido. Atualize o app.');
      } else {
        Alert.alert('Erro', errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleStart = async () => {
    if (startCode.length !== 4) {
      Alert.alert('Erro', 'Código deve ter 4 dígitos');
      return;
    }

    try {
      setActionLoading(true);
      await InstructorRepository.startBooking(bookingId, startCode);
      setShowStartModal(false);
      setStartCode('');
      Alert.alert('Aula Iniciada', 'Boa aula!');
      loadBooking();
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.detail || 'Código inválido');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinish = () => {
    Alert.alert(
      'Finalizar Aula',
      'Confirma que deseja finalizar esta aula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            try {
              setActionLoading(true);
              await InstructorRepository.finishBooking(bookingId);
              Alert.alert('Concluída', 'Aula finalizada com sucesso!');
              loadBooking();
            } catch (err: any) {
              Alert.alert('Erro', err.response?.data?.detail || 'Erro ao finalizar');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    if (!cancelReasonCode) {
      Alert.alert('Erro', 'Selecione um motivo');
      return;
    }

    if (cancelReasonCode === InstructorCancelReasonCode.OTHER && !cancelReasonText.trim()) {
      Alert.alert('Erro', 'Informe o motivo para "Outro"');
      return;
    }

    if (cancelReasonText.length > 140) {
      Alert.alert('Erro', 'Motivo muito longo (máximo 140 caracteres)');
      return;
    }

    try {
      setActionLoading(true);

      const payload: InstructorCancelRequest = {
        reason_code: cancelReasonCode,
        reason_text: cancelReasonCode === InstructorCancelReasonCode.OTHER ? cancelReasonText : undefined,
      };

      await InstructorRepository.cancelBooking(bookingId, payload);
      
      setShowCancelModal(false);
      setCancelReasonCode(null);
      setCancelReasonText('');
      
      Alert.alert('Cancelada', 'Aula cancelada.');
      navigation.goBack();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Erro ao cancelar';
      
      if (err.response?.status === 400 && errorMsg.includes('reason_code')) {
        Alert.alert('Erro', 'Motivo inválido. Atualize o app.');
      } else {
        Alert.alert('Erro', errorMsg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus): string => {
    const colors = {
      [BookingStatus.PENDING]: '#FFC107',
      [BookingStatus.ACCEPTED]: '#4CAF50',
      [BookingStatus.REJECTED]: '#E53935',
      [BookingStatus.IN_PROGRESS]: '#2196F3',
      [BookingStatus.COMPLETED]: '#4CAF50',
      [BookingStatus.CANCELLED_STUDENT]: '#757575',
      [BookingStatus.CANCELLED_INSTRUCTOR]: '#757575',
      [BookingStatus.DISPUTED]: '#FF9800',
      [BookingStatus.NO_SHOW]: '#9E9E9E',
    };
    return colors[status];
  };

  const getStatusLabel = (booking: BookingAPIResponse): string => {
    if (booking.payment_status === 'refunded') return 'Reembolsado';
    const status = booking.status;

    const labels = {
      [BookingStatus.PENDING]: 'Aguardando resposta',
      [BookingStatus.ACCEPTED]: 'Confirmada',
      [BookingStatus.REJECTED]: 'Recusada',
      [BookingStatus.IN_PROGRESS]: 'Em andamento',
      [BookingStatus.COMPLETED]: 'Concluída',
      [BookingStatus.CANCELLED_STUDENT]: 'Cancelada pelo aluno',
      [BookingStatus.CANCELLED_INSTRUCTOR]: 'Cancelada por você',
      [BookingStatus.DISPUTED]: 'Contestada',
      [BookingStatus.NO_SHOW]: 'Não compareceu',
    };
    return labels[status];
  };

  const getStatusIcon = (status: BookingStatus): string => {
    const icons = {
      [BookingStatus.PENDING]: 'clock-outline',
      [BookingStatus.ACCEPTED]: 'check-circle-outline',
      [BookingStatus.REJECTED]: 'close-circle-outline',
      [BookingStatus.IN_PROGRESS]: 'car',
      [BookingStatus.COMPLETED]: 'check-all',
      [BookingStatus.CANCELLED_STUDENT]: 'cancel',
      [BookingStatus.CANCELLED_INSTRUCTOR]: 'cancel',
      [BookingStatus.DISPUTED]: 'alert-octagon',
      [BookingStatus.NO_SHOW]: 'account-off-outline',
    };
    return icons[status];
  };

  const renderActions = () => {
    if (!booking) return null;

    // Reembolso nunca tem ação
    if (booking.payment_status === 'refunded') return null;

    // Aguardando pagamento → sem ações
    if (!booking.can_accept) return null;

    switch (booking.status) {
      case BookingStatus.PENDING:
        return (
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => setShowRejectModal(true)}  // ← ALTERADO
              style={[styles.actionButton, styles.rejectButton]}
              labelStyle={styles.rejectButtonText}
              disabled={actionLoading}
            >
              Recusar
            </Button>
            <Button
              mode="contained"
              onPress={handleAccept}
              style={[styles.actionButton, styles.acceptButton]}
              disabled={actionLoading || !booking.can_accept}
              loading={actionLoading}
            >
              Aceitar
            </Button>
          </View>
        );

      case BookingStatus.ACCEPTED:
        return (
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => setShowCancelModal(true)}
              style={[styles.actionButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowStartModal(true)}
              style={[styles.actionButton, styles.startButton]}
              disabled={actionLoading}
              icon="play"
            >
              Iniciar Aula
            </Button>
          </View>
        );

      case BookingStatus.IN_PROGRESS:
        return (
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={handleFinish}
              style={styles.finishButton}
              disabled={actionLoading}
              loading={actionLoading}
              icon="check"
            >
              Finalizar Aula
            </Button>
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color={colors.error}
        />
        <Text variant="titleMedium" style={styles.errorText}>
          {error || 'Aula não encontrada'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const localDate = fromUTC(booking.scheduled_date);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Status */}
        <View
          style={[
            styles.statusHeader,
            { backgroundColor: booking.payment_status === 'refunded' ? colors.disabled : getStatusColor(booking.status) },
          ]}
        >
          <MaterialCommunityIcons
            name={booking.payment_status === 'refunded' ? 'cash-refund' : getStatusIcon(booking.status)}
            size={32}
            color="#FFFFFF"
          />
          <Text variant="titleLarge" style={styles.statusHeaderText}>
            {getStatusLabel(booking)}
          </Text>
        </View>


        {/* Badge de pagamento (somente quando status = PENDING) */}
        {booking && booking.status === BookingStatus.PENDING && (() => {
          const isRefunded = booking.payment_status === 'refunded';

          const color = isRefunded
            ? colors.disabled
            : (booking.can_accept ? colors.success : colors.warning);

          const label = isRefunded
            ? '💰 Reembolsado'
            : (booking.can_accept ? '✓ Pagamento confirmado' : '⏳ Aguardando pagamento');

          return (
            <View
              style={{
                alignSelf: 'center',
                marginTop: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: color,
              }}
            >
              <Text variant="labelMedium" style={{ color, fontWeight: '600' }}>
                {label}
              </Text>
            </View>
          );
        })()}




        {/* Informações da Aula */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Informações da Aula
          </Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Data
              </Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {formatLocalDate(localDate)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Horário
              </Text>
              <Text variant="bodyLarge" style={styles.infoValue}>
                {formatLocalTime(localDate)} ({booking.duration_minutes} min)
              </Text>
            </View>
          </View>

          {booking.location && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <Text variant="bodySmall" style={styles.infoLabel}>
                  Local
                </Text>
                <Text variant="bodyLarge" style={styles.infoValue}>
                  {booking.location}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="cash"
              size={20}
              color={colors.primary}
            />
            <View style={styles.infoContent}>
              <Text variant="bodySmall" style={styles.infoLabel}>
                Valor Total
              </Text>
              <Text variant="titleMedium" style={styles.priceValue}>
                R$ {booking.total_price.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Informações do Aluno */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Aluno
          </Text>

          <View style={styles.studentCard}>
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons
                name="account"
                size={32}
                color={colors.textSecondary}
              />
            </View>
            <View style={styles.studentInfo}>
              <Text variant="bodySmall" style={styles.studentLabel}>
                Aluno
              </Text>
              <Text variant="bodyLarge" style={styles.studentValue}>
                {booking.student_name}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.locationInfo}>
          <MaterialCommunityIcons 
            name="map-marker" 
            size={20} 
            color={colors.primary} 
          />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text variant="bodySmall" style={styles.locationLabel}>
              Local da Aula
            </Text>
            <Text variant="bodyMedium" style={styles.locationValue}>
              {booking.location}
            </Text>
          </View>
        </View>


        {/* Observações */}
        {booking.notes && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Observações
            </Text>
            <Text variant="bodyMedium" style={styles.notes}>
              {booking.notes}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Ações */}
      {renderActions()}
      
      {/* Modal: Iniciar Aula */}
      <Portal>
        <Modal
          visible={showStartModal}
          onDismiss={() => setShowStartModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Código de Início
          </Text>
          <Text variant="bodyMedium" style={styles.modalDescription}>
            Peça ao aluno o código de 4 dígitos
          </Text>

          <TextInput
            mode="outlined"
            label="Código"
            value={startCode}
            onChangeText={setStartCode}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.codeInput}
            disabled={actionLoading}
          />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowStartModal(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleStart}
              loading={actionLoading}
              disabled={actionLoading || startCode.length !== 4}
            >
              Iniciar
            </Button>
          </View>
        </Modal>

        {/* Modal: Recusar */}
        <Modal
          visible={showRejectModal}
          onDismiss={() => setShowRejectModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Recusar Solicitação
          </Text>
          <Text variant="bodyMedium" style={styles.modalDescription}>
            Selecione o motivo da recusa
          </Text>

          <View style={styles.reasonCodeContainer}>
            {Object.entries(REJECT_REASON_LABELS).map(([code, label]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.reasonCodeOption,
                  rejectReasonCode === code && styles.reasonCodeOptionSelected,
                ]}
                onPress={() => setRejectReasonCode(code as RejectReasonCode)}
                disabled={actionLoading}
              >
                <MaterialCommunityIcons
                  name={rejectReasonCode === code ? 'radiobox-marked' : 'radiobox-blank'}
                  size={24}
                  color={rejectReasonCode === code ? colors.primary : colors.textSecondary}
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.reasonCodeLabel,
                    rejectReasonCode === code && styles.reasonCodeLabelSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {rejectReasonCode === RejectReasonCode.OTHER && (
            <TextInput
              mode="outlined"
              label="Detalhe o motivo"
              value={rejectReasonText}
              onChangeText={setRejectReasonText}
              multiline
              numberOfLines={3}
              maxLength={140}
              style={styles.reasonInput}
              disabled={actionLoading}
              right={<TextInput.Affix text={`${rejectReasonText.length}/140`} />}
            />
          )}

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowRejectModal(false)}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleReject}
              loading={actionLoading}
              disabled={actionLoading || !rejectReasonCode}
              buttonColor={colors.error}
            >
              Recusar Aula
            </Button>
          </View>
        </Modal>

        {/* Modal: Cancelar */}
        <Modal
          visible={showCancelModal}
          onDismiss={() => setShowCancelModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Cancelar Aula
          </Text>
          <Text variant="bodyMedium" style={styles.modalDescription}>
            Selecione o motivo do cancelamento
          </Text>

          <View style={styles.reasonCodeContainer}>
            {Object.entries(INSTRUCTOR_CANCEL_REASON_LABELS).map(([code, label]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.reasonCodeOption,
                  cancelReasonCode === code && styles.reasonCodeOptionSelected,
                ]}
                onPress={() => setCancelReasonCode(code as InstructorCancelReasonCode)}
                disabled={actionLoading}
              >
                <MaterialCommunityIcons
                  name={cancelReasonCode === code ? 'radiobox-marked' : 'radiobox-blank'}
                  size={24}
                  color={cancelReasonCode === code ? colors.primary : colors.textSecondary}
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.reasonCodeLabel,
                    cancelReasonCode === code && styles.reasonCodeLabelSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {cancelReasonCode === InstructorCancelReasonCode.OTHER && (
            <TextInput
              mode="outlined"
              label="Detalhe o motivo"
              value={cancelReasonText}
              onChangeText={setCancelReasonText}
              multiline
              numberOfLines={3}
              maxLength={140}
              style={styles.reasonInput}
              disabled={actionLoading}
              right={<TextInput.Affix text={`${cancelReasonText.length}/140`} />}
            />
          )}

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowCancelModal(false)}
              disabled={actionLoading}
            >
              Voltar
            </Button>
            <Button
              mode="contained"
              onPress={handleCancel}
              loading={actionLoading}
              disabled={actionLoading || !cancelReasonCode}
              buttonColor={colors.error}
            >
              Cancelar Aula
            </Button>
          </View>
        </Modal>
      </Portal>
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
    backgroundColor: colors.background,
    padding: 24,
  },

  errorText: {
    color: colors.error,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },

  backLink: {
    color: colors.primary,
    fontSize: 16,
  },

  scrollView: {
    flex: 1,
  },

  statusHeader: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },

  statusHeaderText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 12,
  },

  sectionTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },

  infoValue: {
    color: colors.text,
  },

  priceValue: {
    color: colors.primary,
    fontWeight: '700',
  },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  studentInfo: {
    flex: 1,
  },

  studentLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },

  studentValue: {
    color: colors.text,
    fontWeight: '500',
  },

  notes: {
    color: colors.textSecondary,
    lineHeight: 22,
  },

  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionButton: {
    flex: 1,
  },

  acceptButton: {
    backgroundColor: colors.primary,
  },

  rejectButton: {
    borderColor: colors.error,
  },

  rejectButtonText: {
    color: colors.error,
  },

  cancelButton: {
    borderColor: colors.error,
  },

  cancelButtonText: {
    color: colors.error,
  },

  startButton: {
    backgroundColor: colors.primary,
  },

  finishButton: {
    backgroundColor: colors.success,
  },

  modal: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 20,
    borderRadius: 8,
  },

  modalTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },

  modalDescription: {
    color: colors.textSecondary,
    marginBottom: 20,
  },

  codeInput: {
    marginBottom: 20,
  },

  reasonInput: {
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  locationInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  reasonCodeContainer: {
  marginVertical: 16,
  gap: 8,
  },
  reasonCodeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  reasonCodeOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E3F2FD',
  },
  reasonCodeLabel: {
    marginLeft: 12,
    color: colors.textSecondary,
  },
  reasonCodeLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});