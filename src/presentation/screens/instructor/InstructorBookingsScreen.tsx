import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Text, Chip, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import InstructorRepository from '@/infrastructure/repositories/InstructorRepository';
import { BookingAPIResponse, BookingStatus } from '@/domain/entities/BookingAPI.types';
import { fromUTC, formatLocalDate, formatLocalTime } from '@/utils/timezone';
import { styles } from '././InstructorBookingsScreen.styles';

type StatusFilter = 'ALL' | BookingStatus;

const statusConfig = {
  [BookingStatus.PENDING]: {
    label: 'Aguardando',
    color: colors.warning,
    icon: 'clock-outline',
    bgColor: colors.warning + '15',
  },
  [BookingStatus.ACCEPTED]: {
    label: 'Confirmada',
    color: colors.success,
    icon: 'check-circle-outline',
    bgColor: colors.success + '15',
  },
  [BookingStatus.REJECTED]: {
    label: 'Recusada',
    color: colors.error,
    icon: 'close-circle-outline',
    bgColor: colors.error + '15',
  },
  [BookingStatus.IN_PROGRESS]: {
    label: 'Em andamento',
    color: colors.accent,
    icon: 'car',
    bgColor: colors.accent + '15',
  },
  [BookingStatus.COMPLETED]: {
    label: 'Concluída',
    color: colors.secondary,
    icon: 'check-all',
    bgColor: colors.secondary + '15',
  },
  [BookingStatus.CANCELLED_STUDENT]: {
    label: 'Cancelada (aluno)',
    color: colors.disabled,
    icon: 'account-cancel',
    bgColor: colors.disabled + '15',
  },
  [BookingStatus.CANCELLED_INSTRUCTOR]: {
    label: 'Cancelada (você)',
    color: colors.disabled,
    icon: 'account-cancel',
    bgColor: colors.disabled + '15',
  },
  [BookingStatus.DISPUTED]: {  
    label: 'Contestada',
    color: '#FF9800',
    icon: 'alert-octagon',
    bgColor: '#FF9800' + '15',
  },
  [BookingStatus.NO_SHOW]: {
    label: 'Não compareceu',
    color: '#9E9E9E',
    icon: 'account-off-outline',
    bgColor: '#9E9E9E' + '15',
  },
};

const FILTER_OPTIONS = [
  { key: 'ALL', label: 'Todas', icon: 'view-grid-outline' },
  { key: BookingStatus.PENDING, label: 'Aguardando', icon: 'clock-outline' },
  { key: BookingStatus.ACCEPTED, label: 'Confirmadas', icon: 'check-circle-outline' },
  { key: BookingStatus.IN_PROGRESS, label: 'Em andamento', icon: 'car' },
  { key: BookingStatus.COMPLETED, label: 'Concluídas', icon: 'check-all' },
];

export const InstructorBookingsScreen = ({ navigation }: any) => {
  const [bookings, setBookings] = useState<BookingAPIResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setError(null);
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;
      const data = await InstructorRepository.listBookings(statusParam);
      setBookings(data);
    } catch (err: any) {
      console.error('Erro ao carregar bookings:', err);
      setError('Não foi possível carregar as solicitações. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, [statusFilter]);

  const getStatusCount = (status: BookingStatus): number => {
    return bookings.filter(b => b.status === status).length;
  };

  const getTotalCount = () => {
    if (statusFilter === 'ALL') return bookings.length;
    return getStatusCount(statusFilter as BookingStatus);
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('InstructorBookingDetail', { bookingId });
  };

  const renderBookingCard = ({ item }: { item: BookingAPIResponse }) => {
    const localDate = fromUTC(item.scheduled_date);
    const status = statusConfig[item.status];

    return (
      <TouchableOpacity
        onPress={() => handleBookingPress(item.id)}
        activeOpacity={0.7}
        style={styles.cardTouchable}
      >
        <Card style={styles.card}>
          <Card.Content>
            {/* Header com aluno e status */}
            <View style={styles.cardHeader}>
              <View style={styles.studentInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: item.instructor_avatar || 'https://via.placeholder.com/48' }}
                    style={styles.avatar}
                  />
                  <View style={[styles.statusIndicator, { backgroundColor: status.color }]} />
                </View>
                <View style={styles.studentText}>
                  <Text variant="titleMedium" style={styles.studentName}>
                    {item.student_name || `Aluno #${item.id.slice(-6)}`}
                  </Text>
                  <View style={styles.infoBadge}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={12}
                      color={colors.textSecondary}
                    />
                    <Text variant="labelSmall" style={styles.infoBadgeText}>
                      {formatLocalDate(fromUTC(item.created_at))}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                <MaterialCommunityIcons
                  name={status.icon as any}
                  size={14}
                  color={status.color}
                />
                <Text
                  variant="labelSmall"
                  style={[styles.statusText, { color: status.color, fontWeight: '700' }]} // Mais peso
                >
                  {status.label}
                </Text>
              </View>
            </View>

            {/* Detalhes da aula */}
            <View style={styles.lessonDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {formatLocalDate(localDate)} • {formatLocalTime(localDate)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text variant="bodyMedium" style={styles.detailText}>
                  {item.duration_minutes} minutos
                </Text>
              </View>

              {item.location && (
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text variant="bodyMedium" style={styles.locationText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              )}

              {item.notes && (
                <View style={styles.notesContainer}>
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text variant="bodySmall" style={styles.notesText} numberOfLines={2}>
                    {item.notes}
                  </Text>
                </View>
              )}
            </View>

            {/* Footer com preço e ações */}
            <View style={styles.cardFooter}>
              <View>
                <Text variant="bodySmall" style={styles.priceLabel}>
                  Valor total
                </Text>
                <Text variant="titleMedium" style={styles.price}>
                  R$ {parseFloat(item.total_price.toString()).toFixed(2)}
                </Text>
              </View>

              {item.status === BookingStatus.PENDING && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    !item.can_accept && { opacity: 0.5 },
                  ]}
                  disabled={!item.can_accept}
                  onPress={() => handleBookingPress(item.id)}
                >
                  <Text style={styles.actionButtonText}>
                    {item.can_accept ? 'Responder' : 'Aguardando pagamento'}
                  </Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={16}
                    color={colors.onPrimary}
                  />
                </TouchableOpacity>
              )}

              {item.status === BookingStatus.ACCEPTED && (
                <Chip
                  mode="outlined"
                  style={[styles.statusChip, { borderColor: status.color }]}
                  textStyle={{ color: status.color }}
                  icon="check"
                >
                  Confirmada
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (option: typeof FILTER_OPTIONS[0]) => {
    const isSelected = statusFilter === option.key;
    const count = option.key === 'ALL' ? bookings.length : getStatusCount(option.key as BookingStatus);

    return (
      <TouchableOpacity
        key={option.key}
        onPress={() => setStatusFilter(option.key as StatusFilter)}
        activeOpacity={0.7}
      >
        <View style={[styles.filterChip, isSelected && styles.filterChipSelected]}>
          <MaterialCommunityIcons
            name={option.icon as any}
            size={16}
            color={isSelected ? colors.onPrimary : colors.textSecondary}
          />
          <Text style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected
          ]}>
            {option.label}
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
      {/* Cabeçalho */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text variant="headlineSmall" style={styles.title}>
          Solicitações
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
        Gerencie suas aulas e solicitações dos alunos
      </Text>

      {/* Filtros */}
      <View style={styles.filtersScrollContainer}>
        <FlatList
          data={FILTER_OPTIONS}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>
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
      <Text variant="titleMedium" style={styles.emptyTitle}>
        Nenhuma solicitação encontrada
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        {statusFilter === 'ALL' 
          ? 'Você ainda não recebeu nenhuma solicitação de aula.'
          : 'Não há solicitações com este status no momento.'}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Carregando solicitações...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorIllustration}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={80}
            color={colors.error}
          />
        </View>
        <Text variant="titleMedium" style={styles.errorTitle}>
          Ops! Algo deu errado
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
        <View style={styles.errorButtons}>
          <TouchableOpacity
            style={[styles.errorButton, styles.errorButtonPrimary]}
            onPress={loadBookings}
          >
            <Text style={styles.errorButtonPrimaryText}>Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.errorButton, styles.errorButtonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonSecondaryText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
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
      />
    </View>
  );
};