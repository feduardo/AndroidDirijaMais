import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Text, Button, Card, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '@/presentation/theme';
import { mockBookings } from '@/shared/data/mockBookings';
import { BookingEntity } from '@/domain/entities/Booking.entity';
import type { StudentStackParamList } from '@/presentation/navigation/StudentStack';

type BookingDetailParams = {
  BookingDetail: {
    bookingId: string;
  };
};

type RouteParams = RouteProp<BookingDetailParams, 'BookingDetail'>;

export const BookingDetailScreen = ({ navigation }: any) => {
  const route = useRoute<RouteParams>();
  const { bookingId } = route.params;

  const bookingData = mockBookings.find(b => b.id === bookingId);
  
  if (!bookingData) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="bodyLarge">Solicitação não encontrada</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  const booking = new BookingEntity(bookingData);

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Aula',
      'Tem certeza que deseja cancelar esta solicitação?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            console.log('Cancelando booking:', bookingId);
            // TODO: Implementar cancelamento
            Alert.alert('Sucesso', 'Solicitação cancelada');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleConfirmCompletion = () => {
    Alert.alert(
      'Confirmar Conclusão',
      'Confirme que a aula foi realizada. O pagamento será liberado ao instrutor.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            console.log('Confirmando conclusão:', bookingId);
            // TODO: Implementar confirmação
            Alert.alert('Sucesso', 'Aula confirmada! Agora você pode avaliar o instrutor.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRate = () => {
    console.log('Avaliar instrutor:', booking.instructorId);
    // TODO: Navegar para tela de avaliação
    Alert.alert('Em breve', 'Sistema de avaliação será implementado');
  };

  const handleChat = () => {
    console.log('Abrir chat com instrutor:', booking.instructorId);
    // TODO: Navegar para tela de chat
    Alert.alert('Em breve', 'Chat será implementado');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
        <Text variant="titleMedium" style={styles.headerTitle}>
          Detalhes da Aula
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <Card.Content>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIcon,
                  { backgroundColor: `${booking.getStatusColor()}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={booking.getStatusIcon()}
                  size={32}
                  color={booking.getStatusColor()}
                />
              </View>
              <Text variant="headlineSmall" style={styles.statusTitle}>
                {booking.getStatusLabel()}
              </Text>
            </View>

            {booking.isAwaitingStudentConfirmation() &&
              booking.getHoursUntilAutoConfirmation() !== null && (
                <View style={styles.autoConfirmAlert}>
                  <MaterialCommunityIcons
                    name="clock-alert-outline"
                    size={20}
                    color={colors.warning}
                  />
                  <Text variant="bodySmall" style={styles.autoConfirmText}>
                    Confirme em até {booking.getHoursUntilAutoConfirmation()}h
                    ou será confirmada automaticamente
                  </Text>
                </View>
              )}
          </Card.Content>
        </Card>

        {/* Instrutor */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Instrutor
            </Text>
            <View style={styles.instructorContainer}>
              <Image
                source={{ uri: booking.instructorAvatar }}
                style={styles.avatar}
              />
              <View style={styles.instructorInfo}>
                <Text variant="titleMedium" style={styles.instructorName}>
                  {booking.instructorName}
                </Text>
                <Text variant="bodySmall" style={styles.category}>
                  Categoria {booking.category}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={handleChat}
              >
                <MaterialCommunityIcons
                  name="message-outline"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Detalhes da Aula */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Detalhes da Aula
            </Text>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={colors.primary}
              />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={styles.detailLabel}>
                  Data
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {booking.date.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={styles.detailLabel}>
                  Horário e Duração
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {booking.time} • {booking.duration} aula
                  {booking.duration > 1 ? 's' : ''} ({booking.duration * 50}{' '}
                  min)
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="map-marker"
                size={20}
                color={colors.primary}
              />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={styles.detailLabel}>
                  Local de Encontro
                </Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {booking.location}
                </Text>
              </View>
            </View>

            {booking.notes && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <View style={styles.detailText}>
                    <Text variant="bodySmall" style={styles.detailLabel}>
                      Observações
                    </Text>
                    <Text variant="bodyMedium" style={styles.detailValue}>
                      {booking.notes}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {/* Valores */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Valores
            </Text>

            <View style={styles.priceRow}>
              <Text variant="bodyMedium">Preço por aula:</Text>
              <Text variant="bodyMedium">R$ {booking.pricePerHour}</Text>
            </View>

            <View style={styles.priceRow}>
              <Text variant="bodyMedium">
                Quantidade de aulas: {booking.duration}
              </Text>
              <Text variant="bodyMedium">
                R$ {booking.pricePerHour * booking.duration}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.priceRow}>
              <Text variant="titleMedium" style={styles.totalLabel}>
                Total:
              </Text>
              <Text variant="titleLarge" style={styles.totalValue}>
                R$ {booking.totalPrice}
              </Text>
            </View>

            {booking.isPaymentReleased() && (
              <View style={styles.paymentAlert}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={colors.success}
                />
                <Text variant="bodySmall" style={styles.paymentText}>
                  Pagamento liberado ao instrutor
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Timeline */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Histórico
            </Text>

            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text variant="bodySmall" style={styles.timelineLabel}>
                    Solicitação criada
                  </Text>
                  <Text variant="bodySmall" style={styles.timelineDate}>
                    {booking.createdAt.toLocaleString('pt-BR')}
                  </Text>
                </View>
              </View>

              {booking.confirmedAt && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text variant="bodySmall" style={styles.timelineLabel}>
                      Confirmada pelo instrutor
                    </Text>
                    <Text variant="bodySmall" style={styles.timelineDate}>
                      {booking.confirmedAt.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              )}

              {booking.startedAt && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text variant="bodySmall" style={styles.timelineLabel}>
                      Aula iniciada
                    </Text>
                    <Text variant="bodySmall" style={styles.timelineDate}>
                      {booking.startedAt.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              )}

              {booking.finishedByInstructorAt && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text variant="bodySmall" style={styles.timelineLabel}>
                      Finalizada pelo instrutor
                    </Text>
                    <Text variant="bodySmall" style={styles.timelineDate}>
                      {booking.finishedByInstructorAt.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              )}

              {booking.completedByStudentAt && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text variant="bodySmall" style={styles.timelineLabel}>
                      Confirmada por você
                    </Text>
                    <Text variant="bodySmall" style={styles.timelineDate}>
                      {booking.completedByStudentAt.toLocaleString('pt-BR')}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Actions Footer */}
      <View style={styles.footer}>
        {booking.studentCanCancel() && (
          <Button
            mode="outlined"
            onPress={handleCancel}
            textColor={colors.error}
            style={styles.cancelButton}
          >
            Cancelar Aula
          </Button>
        )}

        {booking.studentCanConfirmCompletion() && (
          <Button
            mode="contained"
            onPress={handleConfirmCompletion}
            style={styles.confirmButton}
          >
            Confirmar Conclusão
          </Button>
        )}

        {booking.studentCanRate() && (
          <Button
            mode="contained"
            onPress={handleRate}
            icon="star"
            style={styles.rateButton}
          >
            Avaliar Instrutor
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: colors.text,
    fontWeight: '600',
  },

  headerSpacer: {
    width: 44,
  },

  content: {
    flex: 1,
  },

  statusCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
  },

  statusContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statusTitle: {
    color: colors.text,
    fontWeight: '700',
  },

  autoConfirmAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },

  autoConfirmText: {
    flex: 1,
    color: '#856404',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 16,
  },

  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  instructorInfo: {
    flex: 1,
  },

  instructorName: {
    color: colors.text,
    fontWeight: '600',
  },

  category: {
    color: colors.textSecondary,
    marginTop: 2,
  },

  chatButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  detailText: {
    flex: 1,
  },

  detailLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },

  detailValue: {
    color: colors.text,
  },

  divider: {
    marginVertical: 16,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  totalLabel: {
    color: colors.text,
    fontWeight: '700',
  },

  totalValue: {
    color: colors.primary,
    fontWeight: '700',
  },

  paymentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },

  paymentText: {
    flex: 1,
    color: colors.success,
  },

  timeline: {
    gap: 16,
  },

  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 6,
  },

  timelineContent: {
    flex: 1,
  },

  timelineLabel: {
    color: colors.text,
    marginBottom: 2,
  },

  timelineDate: {
    color: colors.textSecondary,
  },

  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },

  cancelButton: {
    borderColor: colors.error,
  },

  confirmButton: {
    backgroundColor: colors.success,
  },

  rateButton: {
    backgroundColor: colors.warning,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
});