import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  backButton: {
    marginRight: 8,
  },

  headerTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 22,
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },

  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
  },

  bookingCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarPlaceholder: {
    marginRight: 16,
  },

  instructorInfo: {
    flex: 1,
  },

  instructorName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 20,
    marginBottom: 4,
  },

  instructorRole: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  divider: {
    marginVertical: 16,
    backgroundColor: colors.border,
  },

  bookingDetails: {
    gap: 12,
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
    fontSize: 13,
    marginBottom: 2,
  },

  detailValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },

  notesContainer: {
    backgroundColor: colors.info + '10',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },

  notesLabel: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },

  notesText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  ratingCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  cardTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  },

  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  ratingLabel: {
    color: colors.text,
    marginBottom: 16,
    fontSize: 16,
  },

  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },

  starButton: {
    padding: 4,
  },

  clearRatingButton: {
    marginTop: 4,
  },

  criteriaTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 16,
    fontSize: 16,
  },

  criteriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },

  criteriaItem: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },

  criteriaItemSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },

  criteriaItemDisabled: {
    opacity: 0.7,
  },

  criteriaIcon: {
    marginBottom: 8,
  },

  criteriaLabel: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },

  criteriaLabelSelected: {
    color: colors.primary,
  },

  criteriaDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },

  criteriaDescriptionSelected: {
    color: colors.text,
  },

  commentTitle: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
  },

  commentInput: {
    backgroundColor: colors.surface,
    fontSize: 15,
  },

  commentOutline: {
    borderRadius: 12,
  },

  commentCounter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },

  commentCounterText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  reviewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },

  reviewStatusText: {
    color: colors.success,
    flex: 1,
    fontSize: 14,
  },

  actionsCard: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  actionsContent: {
    gap: 16,
  },

  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },

  disputeButton: {
    borderColor: colors.error,
    borderRadius: 12,
  },

  buttonContent: {
    paddingVertical: 10,
  },

  disputeHelper: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },

  alreadyReviewed: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  alreadyReviewedText: {
    color: colors.success,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  errorHelper: {
    textAlign: 'center',
  },

  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 20,
  },

  dialogTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
  },

  dialogContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  dialogText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },

  dialogRating: {
    color: colors.warning,
    fontWeight: '600',
    marginTop: 8,
  },

  disputeWarning: {
    color: colors.error,
    marginBottom: 16,
    fontWeight: '500',
  },

  disputeInput: {
    backgroundColor: colors.surface,
    fontSize: 15,
  },

  disputeCounter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },

  disputeCounterText: {
    fontSize: 13,
  },

  disputeCounterError: {
    color: colors.error,
  },

  disabledButton: {
    opacity: 0.5,
  },
});