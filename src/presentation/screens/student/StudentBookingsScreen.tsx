import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Text, Chip, Card, Portal, Modal, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import BookingRepository from '@/infrastructure/repositories/BookingRepository';
import { styles } from './StudentBookingsScreen.styles';
import { BookingEntity, BookingStatus } from '@/domain/entities/Booking.entity';
import {
  StudentCancelReasonCode,
  STUDENT_CANCEL_REASON_LABELS,
  StudentCancelRequest,
} from '@/domain/entities/BookingReason.types';

import ENV from '@/core/config/env';

import { Linking, Alert } from 'react-native';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';


type StatusFilter = 'ALL' | BookingStatus;

const statusFilters = [
  { key: 'ALL' as StatusFilter, label: 'Todas', icon: 'view-grid-outline' },
  { key: BookingStatus.PENDING, label: 'Aguardando', icon: 'clock-outline' },
  { key: BookingStatus.ACCEPTED, label: 'Confirmadas', icon: 'check-circle-outline' },
  { key: BookingStatus.AWAITING_STUDENT_CONFIRMATION, label: 'Confirmar', icon: 'alert-circle-outline' },
  { key: BookingStatus.IN_PROGRESS, label: 'Em andamento', icon: 'progress-clock' },
  { key: BookingStatus.COMPLETED, label: 'Concluídas', icon: 'check-all' },
  { key: BookingStatus.CANCELLED_STUDENT, label: 'Canceladas', icon: 'close-circle-outline' },
  { key: BookingStatus.REJECTED, label: 'Recusadas', icon: 'cancel' },
  { key: BookingStatus.DISPUTED, label: 'Contestadas', icon: 'alert-octagon' },
];

export const StudentBookingsScreen = ({ navigation }: any) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [bookings, setBookings] = useState<BookingEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
    // Modal de cancelamento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingEntity | null>(null);
  const [cancelReasonCode, setCancelReasonCode] = useState<StudentCancelReasonCode | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  

  const paymentRepository = new PaymentRepository();

  const handlePay = async (booking: BookingEntity) => {
    try {
      const response = await paymentRepository.createIntent(booking.id);

      // navega para o checkout DENTRO do app
      navigation.navigate('Payment', {
        checkoutUrl: response.checkout_url,
        bookingId: booking.id,
        paymentId: response.payment_id,
        preferenceId: response.preference_id,
      });

      return; // <- impede cair no Alert abaixo
    } catch (error: any) {
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;

      if (
        (status === 400 || status === 409) &&
        detail === 'Pagamento pendente. Aguardando Informação da Operadora.'
      ) {
        Alert.alert(
          'Pagamento pendente',
          'Já existe um pagamento em processamento. Aguarde a confirmação da operadora.'
        );
        return;
      }

      if (status === 400 && detail === 'Payment already paid') {
        Alert.alert(
          'Pagamento já realizado',
          'Este agendamento já foi pago.'
        );
        return;
      }

      Alert.alert(
        'Erro no pagamento',
        detail || 'Não foi possível iniciar o pagamento.'
      );
    }
  };



  const loadBookings = async () => {
    try {
      setError(null);
      const data = await BookingRepository.listStudentBookings();
      
      const entities = data.map(b => {
        let mappedStatus: BookingStatus;
        
        switch (b.status) {
          case 'pending':
            mappedStatus = BookingStatus.PENDING;
            break;
          case 'accepted':
            mappedStatus = BookingStatus.ACCEPTED;
            break;
          case 'in_progress':
            mappedStatus = BookingStatus.IN_PROGRESS;
            break;
          case 'completed':
            mappedStatus = b.confirmed_at 
              ? BookingStatus.COMPLETED 
              : BookingStatus.AWAITING_STUDENT_CONFIRMATION;
            break;
          case 'rejected':
            mappedStatus = BookingStatus.REJECTED;
            break;
          case 'cancelled_student':
            mappedStatus = BookingStatus.CANCELLED_STUDENT;
            break;
          case 'cancelled_instructor':
            mappedStatus = BookingStatus.CANCELLED_INSTRUCTOR;
            break;
          case 'disputed':
            mappedStatus = BookingStatus.DISPUTED;
            break;
          case 'no_show':
            mappedStatus = BookingStatus.NO_SHOW;
            break;
          default:
            mappedStatus = BookingStatus.PENDING;
        }

        return new BookingEntity({
          id: b.id,
          studentId: b.student_id,
          instructorId: b.instructor_id,
          instructorName: b.instructor_name,
          instructorAvatar:
            b.instructor_avatar
              ? `${ENV.API_URL}${b.instructor_avatar}`
              : `${ENV.API_URL}/public/avatars/${b.instructor_id}.jpg`,
          date: new Date(b.scheduled_date),
          time: new Date(b.scheduled_date).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          duration: Math.round(b.duration_minutes / 50),
          location: b.location || 'Local não informado',
          status: mappedStatus,
          pricePerHour: b.price_per_hour,
          totalPrice: b.total_price,
          category: 'B',
          startCode: b.start_code,
          createdAt: new Date(b.created_at),
          updatedAt: new Date(b.updated_at),
          paymentReleased: false,
          finishedByInstructorAt: b.finished_at ? new Date(b.finished_at) : undefined,
          completedByStudentAt: b.confirmed_at ? new Date(b.confirmed_at) : undefined,
          paymentStatus: b.payment_status ?? null,
          paymentMethod: b.payment_method ?? null,
          canCancel: b.can_cancel ?? true,

        });
      });
      
      setBookings(entities);
    } catch (error: any) {
      console.error('Erro ao carregar bookings:', error);
      setError('Não foi possível carregar suas solicitações. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    loadBookings();
  };

  const filteredBookings = bookings.filter(
    booking => statusFilter === 'ALL' || booking.status === statusFilter
  );

  const getStatusCount = (status: BookingStatus): number => {
    return bookings.filter(b => b.status === status).length;
  };



  const getTimeUntilBooking = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Passada';
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    return `Em ${diffDays} dias`;
  };

  const handleEvaluate = (booking: BookingEntity) => {
    navigation.navigate('BookingConfirmation', {
      bookingId: booking.id,
      summary: {
        instructor_name: booking.instructorName,
        scheduled_date: booking.date.toISOString(),
      },
    });
  };

  const handleCancelBooking = (booking: BookingEntity) => {
  setBookingToCancel(booking);
  setShowCancelModal(true);
};

  const confirmCancelBooking = async () => {
    if (!cancelReasonCode) {
      Alert.alert('Erro', 'Selecione um motivo');
      return;
    }

    if (cancelReasonCode === StudentCancelReasonCode.OTHER && !cancelReasonText.trim()) {
      Alert.alert('Erro', 'Informe o motivo para "Outro"');
      return;
    }

    if (cancelReasonText.length > 140) {
      Alert.alert('Erro', 'Motivo muito longo (máximo 140 caracteres)');
      return;
    }

    try {
      setCancelLoading(true);

      const payload: StudentCancelRequest = {
        reason_code: cancelReasonCode,
        reason_text: cancelReasonCode === StudentCancelReasonCode.OTHER ? cancelReasonText : undefined,
      };

      await BookingRepository.cancel(bookingToCancel!.id, payload);
      
      setShowCancelModal(false);
      setBookingToCancel(null);
      setCancelReasonCode(null);
      setCancelReasonText('');
      
      Alert.alert('Cancelada', 'Aula cancelada com sucesso.');
      await loadBookings();
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Não foi possível cancelar. Tente novamente.';
      
      if (err.response?.status === 400 && errorMsg.includes('reason_code')) {
        Alert.alert('Erro', 'Motivo inválido. Atualize o app.');
      } else {
        Alert.alert('Erro', errorMsg);
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const renderBookingCard = ({ item }: { item: BookingEntity }) => {
    const timeUntil = getTimeUntilBooking(item.date);
    const isUpcoming =
      item.status === BookingStatus.ACCEPTED || item.status === BookingStatus.IN_PROGRESS;

    const shouldEvaluate = item.status === BookingStatus.AWAITING_STUDENT_CONFIRMATION;
    const payStatus = item.paymentStatus ?? null;
    const isTerminalBooking =
      item.status === BookingStatus.CANCELLED_STUDENT ||
      item.status === BookingStatus.CANCELLED_INSTRUCTOR ||
      item.status === BookingStatus.REJECTED ||
      item.status === BookingStatus.COMPLETED ||
      item.status === BookingStatus.NO_SHOW;

    const canShowCancel = !isTerminalBooking && (item.canCancel ?? true);
    
    const showProcessingInfo = !isTerminalBooking && item.paymentStatus === 'processing';
    const showFailedInfo = !isTerminalBooking && item.paymentStatus === 'failed';

    const shouldShowPay = item.paymentStatus === 'failed' && !isTerminalBooking;
    
    return (
        <TouchableOpacity
          onPress={() => {
            if (shouldEvaluate) {
              handleEvaluate(item);
            }
          }}
          activeOpacity={0.7}
          style={styles.cardTouchable}
        >
        <Card style={styles.card} mode="elevated" elevation={2}>
          <Card.Content>
            {/* Header com instrutor e status */}
            <View style={styles.cardHeader}>
              <View style={styles.instructorInfo}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: item.instructorAvatar }} style={styles.avatar} />
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: item.getStatusColor() },
                    ]}
                  />
                </View>

                <View style={styles.instructorText}>
                  <Text variant="titleMedium" style={styles.instructorName}>
                    {item.instructorName}
                  </Text>

                  <View style={styles.categoryBadge}>
                    <MaterialCommunityIcons name="car-outline" size={12} color={colors.primary} />
                    <Text variant="labelSmall" style={styles.category}>
                      Cat. {item.category}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${item.getStatusColor()}15` },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.getStatusIcon()}
                  size={14}
                  color={item.getStatusColor()}
                />
              <Text
                variant="labelSmall"
                style={[styles.statusText, { color: item.getStatusColor() }]}
              >
                {showProcessingInfo
                  ? 'Processando pagamento'
                  : showFailedInfo
                    ? 'Pagamento falhou'
                    : item.getStatusLabel()}
              </Text>


              </View>
            </View>

            {/* Detalhes da aula */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    Data e hora
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailText}>
                    {item.date.toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                    })}{' '}
                    • {item.time}
                  </Text>
                </View>

                {isUpcoming && (
                  <Chip compact style={styles.timeChip} textStyle={styles.timeChipText}>
                    {timeUntil}
                  </Chip>
                )}
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons name="timer-outline" size={18} color={colors.primary} />
                </View>

                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    Duração
                  </Text>
                  <Text variant="bodyMedium" style={styles.detailText}>
                    {item.duration} aula{item.duration > 1 ? 's' : ''} •{' '}
                    {item.duration * 50} minutos
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.detailTextContainer}>
                  <Text variant="bodySmall" style={styles.detailLabel}>
                    Local
                  </Text>
                  <Text variant="bodyMedium" style={styles.locationText}>
                    {item.location}
                  </Text>
                </View>
              </View>
            </View>

            {/* Código de início (se aplicável) */}
            {item.startCode && item.status === BookingStatus.ACCEPTED && (
              <View style={styles.startCodeContainer}>
                <View style={styles.startCodeHeader}>
                  <MaterialCommunityIcons name="key-variant" size={20} color={colors.primary} />
                  <Text variant="labelMedium" style={styles.startCodeTitle}>
                    Código de Início
                  </Text>
                </View>
                <View style={styles.startCodeDisplay}>
                  <Text variant="headlineMedium" style={styles.startCode}>
                    {item.startCode}
                  </Text>
                  <Text variant="bodySmall" style={styles.startCodeHint}>
                    Forneça ao instrutor no início da aula
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.cardFooter}>
              <View>
                <Text variant="bodySmall" style={styles.priceLabel}>Valor total</Text>
                <Text variant="titleMedium" style={styles.price}>
                  R$ {Number(item.totalPrice).toFixed(2)}
                </Text>
              </View>

              {/* ✅ AÇÕES (Pagar + Cancelar) */}
              {item.status === BookingStatus.COMPLETED ? (
                item.completedByStudentAt ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonEvaluated]}
                    onPress={() => handleEvaluate(item)}
                  >
                    <Text style={styles.actionButtonText}>Avaliado</Text>
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleEvaluate(item)}>
                    <Text style={styles.actionButtonText}>Avaliar</Text>
                    <MaterialCommunityIcons name="star" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )
              ) : (
                <View style={{ flexDirection: 'row', gap: 8 }}>
              {shouldShowPay && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPending]}
                  onPress={() => handlePay(item)}
                >
                  <Text style={styles.actionButtonText}>Pagar</Text>
                  <MaterialCommunityIcons name="credit-card-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              )}

                {canShowCancel && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonPending]}
                    onPress={() => handleCancelBooking(item)}
                  >
                    <Text style={styles.actionButtonText}>Cancelar</Text>
                    <MaterialCommunityIcons name="close" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}

                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };


  const renderFilterChip = (filter: typeof statusFilters[0]) => {
    const isSelected = statusFilter === filter.key;
    const count = filter.key === 'ALL' ? bookings.length : getStatusCount(filter.key as BookingStatus);
    
    return (
      <TouchableOpacity
        key={filter.key}
        onPress={() => setStatusFilter(filter.key)}
        activeOpacity={0.7}
      >
        <View style={[styles.filterChip, isSelected && styles.filterChipSelected]}>
          <MaterialCommunityIcons
            name={filter.icon as any}
            size={16}
            color={isSelected ? colors.onPrimary : colors.textSecondary}
          />
          <Text style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected
          ]}>
            {filter.label}
          </Text>
          {count > 0 && (
            <View style={styles.filterCount}>
              <Text style={[
                styles.filterCountText,
                isSelected && styles.filterCountTextSelected
              ]}>
                {count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text variant="headlineSmall" style={styles.title}>
          Minhas Solicitações
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color={refreshing ? colors.disabled : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Acompanhe suas aulas e solicitações
      </Text>

      {/* Contador */}
      <View style={styles.counterContainer}>
        <Text variant="titleMedium" style={styles.counterText}>
          {filteredBookings.length} {statusFilter === 'ALL' ? 'solicitações' : 'neste status'}
        </Text>
      </View>

      {/* Filtros com scroll horizontal */}
      <View style={styles.filtersScrollContainer}>
        <FlatList
          data={statusFilters}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={item => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Modal: Cancelar Aula */}
      <Portal>
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
            {Object.entries(STUDENT_CANCEL_REASON_LABELS).map(([code, label]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.reasonCodeOption,
                  cancelReasonCode === code && styles.reasonCodeOptionSelected,
                ]}
                onPress={() => setCancelReasonCode(code as StudentCancelReasonCode)}
                disabled={cancelLoading}
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

          {cancelReasonCode === StudentCancelReasonCode.OTHER && (
            <TextInput
              mode="outlined"
              label="Detalhe o motivo"
              value={cancelReasonText}
              onChangeText={setCancelReasonText}
              multiline
              numberOfLines={3}
              maxLength={140}
              style={styles.reasonInput}
              disabled={cancelLoading}
              right={<TextInput.Affix text={`${cancelReasonText.length}/140`} />}
            />
          )}

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowCancelModal(false)}
              disabled={cancelLoading}
            >
              Voltar
            </Button>
            <Button
              mode="contained"
              onPress={confirmCancelBooking}
              loading={cancelLoading}
              disabled={cancelLoading || !cancelReasonCode}
              buttonColor={colors.error}
            >
              Cancelar Aula
            </Button>
          </View>
        </Modal>
      </Portal>
            
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <MaterialCommunityIcons
          name="calendar-blank-outline"
          size={80}
          color={colors.border}
        />
      </View>
      <Text variant="titleLarge" style={styles.emptyTitle}>
        Nenhuma solicitação
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        {statusFilter === 'ALL' 
          ? 'Você ainda não solicitou nenhuma aula.'
          : 'Não há solicitações com este status.'}
      </Text>
      {statusFilter !== 'ALL' && (
        <TouchableOpacity
          style={styles.showAllButton}
          onPress={() => setStatusFilter('ALL')}
        >
          <Text style={styles.showAllText}>Ver todas as solicitações</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={64}
        color={colors.error}
      />
      <Text variant="titleMedium" style={styles.errorTitle}>
        Ops! Algo deu errado
      </Text>
      <Text variant="bodyMedium" style={styles.errorText}>
        {error}
      </Text>
      <TouchableOpacity
        style={styles.errorButton}
        onPress={loadBookings}
      >
        <Text style={styles.errorButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Carregando suas solicitações...
        </Text>
      </View>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <View style={styles.container}>
        {renderError()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBookings}
        keyExtractor={item => item.id}
        renderItem={renderBookingCard}
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