import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  HelperText,
  IconButton,
  Portal,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import httpClient from '@/infrastructure/http/client';
import BookingRepository from '@/infrastructure/repositories/BookingRepository';
import { colors } from '@/presentation/theme';
import { styles } from '././BookingConfirmationScreen.styles';

type BookingDetail = {
  id: string;
  instructor_id: string;
  scheduled_date: string;
  duration_minutes: number;
  status: string;
  notes?: string | null;
  location?: string | null;
  instructor_avatar?: string;
  instructor_name?: string;
};

type RouteParams = {
  bookingId: string;
  summary?: {
    instructor_name?: string;
    instructor_avatar?: string;
    scheduled_date?: string;
  };
};

const MAX_DISPUTE_REASON = 1000;
const MIN_DISPUTE_REASON = 50;
const MAX_REVIEW_COMMENT = 500;

const EVAL_ITEMS = [
  { 
    key: 'cordialidade', 
    label: 'Cordialidade', 
    icon: 'account-heart-outline',
    description: 'Educado e respeitoso'
  },
  { 
    key: 'pontualidade', 
    label: 'Pontualidade', 
    icon: 'clock-outline',
    description: 'Chegou no horário'
  },
  { 
    key: 'clareza', 
    label: 'Clareza', 
    icon: 'message-text-outline',
    description: 'Explicações claras'
  },
  { 
    key: 'seguranca', 
    label: 'Segurança', 
    icon: 'shield-check-outline',
    description: 'Transmissão de segurança'
  },
  { 
    key: 'paciencia', 
    label: 'Paciência', 
    icon: 'heart-outline',
    description: 'Atendimento paciente'
  },
] as const;

type EvalKey = (typeof EVAL_ITEMS)[number]['key'];

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId, summary } = (route.params || {}) as RouteParams;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [selectedEval, setSelectedEval] = useState<Record<EvalKey, boolean>>({
    cordialidade: false,
    pontualidade: false,
    clareza: false,
    seguranca: false,
    paciencia: false,
  });
  const [reviewComment, setReviewComment] = useState('');
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [submittingConfirm, setSubmittingConfirm] = useState(false);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingReview, setExistingReview] = useState<any | null>(null);
  const [hasReview, setHasReview] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoadingBooking(true);
        setErrorMsg('');

        const data = await httpClient
          .get(`/api/v1/bookings/${bookingId}`)
          .then(r => r.data as BookingDetail);

        if (!mounted) return;
        setBooking(data);

        const review = await BookingRepository.getReview(bookingId);
        
        if (review && mounted) {
          setExistingReview(review);
          setHasReview(true);
          setRating(review.rating);
          setSelectedEval({
            cordialidade: review.cordiality_check,
            pontualidade: review.punctuality_check,
            clareza: review.clarity_check,
            seguranca: review.safety_check,
            paciencia: review.patience_check,
          });
          setReviewComment(review.comment || '');
        }
      } catch (err: any) {
        if (!mounted) return;
        setErrorMsg(err?.response?.data?.detail || 'Não foi possível carregar os detalhes da aula.');
      } finally {
        if (mounted) setLoadingBooking(false);
      }
    }

    if (bookingId) load();
    else {
      setLoadingBooking(false);
      setErrorMsg('ID da reserva não informado.');
    }

    return () => {
      mounted = false;
    };
  }, [bookingId]);

  const instructorName = booking?.instructor_name || summary?.instructor_name || 'Instrutor(a)';
  const instructorAvatar = booking?.instructor_avatar || summary?.instructor_avatar;
  const scheduledDate = booking?.scheduled_date || summary?.scheduled_date || '';

  const canSubmitDisputeReason =
    disputeReason.trim().length >= MIN_DISPUTE_REASON &&
    disputeReason.trim().length <= MAX_DISPUTE_REASON;

  const formatDateTime = (iso?: string) => {
    if (!iso) return '';
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const getDurationHours = () => {
    if (!booking?.duration_minutes) return '';
    const hours = Math.floor(booking.duration_minutes / 60);
    const minutes = booking.duration_minutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}min` : ''}`.trim();
    }
    return `${minutes}min`;
  };

  const toggleEval = (key: EvalKey) => {
    if (hasReview) return;
    setSelectedEval(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showConfirmDialog = () => {
    if (!rating) {
      Alert.alert(
        'Avaliação Opcional',
        'Você pode confirmar a aula sem avaliar, mas sua avaliação ajuda outros alunos. Deseja continuar sem avaliar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar sem avaliar', onPress: handleConfirm }
        ]
      );
    } else {
      setShowConfirmationDialog(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setSubmittingConfirm(true);
      setErrorMsg('');
      setShowConfirmationDialog(false);

      await BookingRepository.confirmBooking(bookingId);

      if (rating > 0) {
        await BookingRepository.createReview(bookingId, {
          rating,
          cordiality_check: selectedEval.cordialidade,
          punctuality_check: selectedEval.pontualidade,
          clarity_check: selectedEval.clareza,
          safety_check: selectedEval.seguranca,
          patience_check: selectedEval.paciencia,
          comment: reviewComment.trim() || undefined,
        });
      }

      Alert.alert(
        '✅ Confirmação Realizada',
        'Aula confirmada com sucesso! Obrigado pela sua avaliação.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Falha ao salvar avaliação/confirmação. Tente novamente.');
    } finally {
      setSubmittingConfirm(false);
    }
  };

  const handleDispute = async () => {
    try {
      setSubmittingDispute(true);
      setErrorMsg('');

      await BookingRepository.disputeBooking(bookingId, disputeReason.trim());

      setDisputeOpen(false);
      Alert.alert(
        '⚠️ Contestação Enviada',
        'Sua contestação foi registrada. Entraremos em contato em até 48h.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Falha ao contestar a aula. Tente novamente.');
    } finally {
      setSubmittingDispute(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
      <Text variant="headlineSmall" style={styles.headerTitle}>
        {hasReview ? 'Avaliação Realizada' : 'Avaliar Aula'}
      </Text>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text variant="bodyMedium" style={styles.loadingText}>
        Carregando detalhes da aula...
      </Text>
    </View>
  );

  const renderBookingInfo = () => (
    <Card style={styles.bookingCard}>
      <Card.Content>
        <View style={styles.instructorHeader}>
          <View style={styles.avatarPlaceholder}>
            {instructorAvatar ? (
              <MaterialCommunityIcons name="account-circle" size={56} color={colors.primary} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={56} color={colors.primary} />
            )}
          </View>
          <View style={styles.instructorInfo}>
            <Text variant="titleMedium" style={styles.instructorName}>
              {instructorName}
            </Text>
            <Text variant="bodySmall" style={styles.instructorRole}>
              Instrutor de Direção
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text variant="bodySmall" style={styles.detailLabel}>Data e Horário</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {formatDateTime(scheduledDate)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="timer-outline" size={20} color={colors.primary} />
            <View style={styles.detailText}>
              <Text variant="bodySmall" style={styles.detailLabel}>Duração</Text>
              <Text variant="bodyMedium" style={styles.detailValue}>
                {getDurationHours()}
              </Text>
            </View>
          </View>

          {booking?.location && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.primary} />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={styles.detailLabel}>Local</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {booking.location}
                </Text>
              </View>
            </View>
          )}
        </View>

        {booking?.notes && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.notesContainer}>
              <Text variant="labelMedium" style={styles.notesLabel}>
                Observações da aula
              </Text>
              <Text variant="bodyMedium" style={styles.notesText}>
                {booking.notes}
              </Text>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );

  const renderRatingSection = () => (
    <Card style={styles.ratingCard}>
      <Card.Title 
        title="Avaliação Geral" 
        subtitle={hasReview ? "Sua avaliação já foi enviada" : "Como foi sua experiência?"}
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        <View style={styles.ratingContainer}>
          <Text variant="bodyMedium" style={styles.ratingLabel}>
            Nota geral
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => !hasReview && setRating(star)}
                disabled={hasReview}
                style={styles.starButton}
              >
                <MaterialCommunityIcons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? colors.warning : colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && !hasReview && (
            <Button
              mode="text"
              onPress={() => setRating(0)}
              style={styles.clearRatingButton}
            >
              Limpar avaliação
            </Button>
          )}
        </View>

        <Divider style={styles.divider} />

        <Text variant="bodyMedium" style={styles.criteriaTitle}>
          Quais qualidades se destacaram?
        </Text>
        <View style={styles.criteriaGrid}>
          {EVAL_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.criteriaItem,
                selectedEval[item.key] && styles.criteriaItemSelected,
                hasReview && styles.criteriaItemDisabled
              ]}
              onPress={() => toggleEval(item.key)}
              disabled={hasReview}
            >
              <View style={styles.criteriaIcon}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={24}
                  color={selectedEval[item.key] ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text
                variant="labelMedium"
                style={[
                  styles.criteriaLabel,
                  selectedEval[item.key] && styles.criteriaLabelSelected
                ]}
              >
                {item.label}
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.criteriaDescription,
                  selectedEval[item.key] && styles.criteriaDescriptionSelected
                ]}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Text variant="bodyMedium" style={styles.commentTitle}>
          Comentários adicionais (opcional)
        </Text>
        <TextInput
          mode="outlined"
          value={reviewComment}
          onChangeText={t => !hasReview && setReviewComment(t.slice(0, MAX_REVIEW_COMMENT))}
          multiline
          numberOfLines={4}
          placeholder="Compartilhe sua experiência em detalhes..."
          disabled={hasReview}
          style={styles.commentInput}
          outlineStyle={styles.commentOutline}
        />
        <View style={styles.commentCounter}>
          <Text variant="bodySmall" style={styles.commentCounterText}>
            {reviewComment.length}/{MAX_REVIEW_COMMENT} caracteres
          </Text>
        </View>

        {hasReview && existingReview && (
          <View style={styles.reviewStatus}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
            <Text variant="bodySmall" style={styles.reviewStatusText}>
              Avaliação enviada em {new Date(existingReview.created_at).toLocaleString('pt-BR')}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  const renderActions = () => (
    <Card style={styles.actionsCard}>
      <Card.Title 
        title="Ações Disponíveis"
        titleStyle={styles.cardTitle}
      />
      <Card.Content style={styles.actionsContent}>
        {!hasReview ? (
          <>
            <Button
              mode="contained"
              onPress={showConfirmDialog}
              disabled={loadingBooking || submittingConfirm || submittingDispute}
              loading={submittingConfirm}
              style={styles.confirmButton}
              contentStyle={styles.buttonContent}
              icon="check-circle-outline"
            >
              Confirmar Conclusão da Aula
            </Button>

            <Button
              mode="outlined"
              onPress={() => setDisputeOpen(true)}
              disabled={loadingBooking || submittingConfirm || submittingDispute}
              style={styles.disputeButton}
              contentStyle={styles.buttonContent}
              icon="alert-circle-outline"
            >
              Contestar Esta Aula
            </Button>

            <HelperText type="info" style={styles.disputeHelper}>
              Use esta opção apenas se houver problemas graves na aula.
            </HelperText>
          </>
        ) : (
          <View style={styles.alreadyReviewed}>
            <MaterialCommunityIcons name="check-all" size={48} color={colors.success} />
            <Text variant="bodyMedium" style={styles.alreadyReviewedText}>
              Esta aula já foi avaliada e confirmada.
            </Text>
          </View>
        )}

        {errorMsg && (
          <HelperText type="error" style={styles.errorHelper}>
            {errorMsg}
          </HelperText>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loadingBooking ? renderLoading() : (
          <>
            {renderBookingInfo()}
            {renderRatingSection()}
            {renderActions()}
          </>
        )}
      </ScrollView>

      <Portal>
        <Dialog 
          visible={showConfirmationDialog} 
          onDismiss={() => setShowConfirmationDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Confirmar Conclusão
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogContent}>
              <MaterialCommunityIcons name="check-circle" size={48} color={colors.primary} />
              <Text variant="bodyMedium" style={styles.dialogText}>
                Você está prestes a confirmar a conclusão desta aula com {instructorName}.
              </Text>
              {rating > 0 && (
                <Text variant="bodySmall" style={styles.dialogRating}>
                  Sua avaliação: {rating} estrela(s)
                </Text>
              )}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmationDialog(false)}>
              Revisar
            </Button>
            <Button mode="contained" onPress={handleConfirm}>
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog 
          visible={disputeOpen} 
          onDismiss={() => setDisputeOpen(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            ⚠️ Contestar Aula
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.disputeWarning}>
              Descreva detalhadamente o problema ocorrido durante a aula:
            </Text>
            <TextInput
              mode="outlined"
              value={disputeReason}
              onChangeText={t => setDisputeReason(t.slice(0, MAX_DISPUTE_REASON))}
              multiline
              numberOfLines={5}
              placeholder="Ex: Instrutor chegou 30 minutos atrasado, não corrigiu erros básicos..."
              style={styles.disputeInput}
            />
            <View style={styles.disputeCounter}>
              <Text 
                variant="bodySmall" 
                style={[
                  styles.disputeCounterText,
                  disputeReason.trim().length < MIN_DISPUTE_REASON && styles.disputeCounterError
                ]}
              >
                {disputeReason.trim().length}/{MAX_DISPUTE_REASON} caracteres
                {disputeReason.trim().length < MIN_DISPUTE_REASON && 
                  ` (mínimo ${MIN_DISPUTE_REASON})`}
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDisputeOpen(false)} disabled={submittingDispute}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleDispute}
              disabled={!canSubmitDisputeReason || submittingDispute}
              loading={submittingDispute}
              style={!canSubmitDisputeReason && styles.disabledButton}
            >
              Enviar Contestação
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}