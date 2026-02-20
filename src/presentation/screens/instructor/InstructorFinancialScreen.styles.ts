import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  content: {
    padding: 16,
    paddingBottom: 32,
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
    fontSize: 16,
  },

  emptyCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },

  emptyState: {
    alignItems: 'center',
    padding: 32,
  },

  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  emptyTitle: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
    fontSize: 20,
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },

  emptyButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  buttonContent: {
    paddingVertical: 8,
  },

  pixChip: {
    marginTop: 16,
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },

  pixChipText: {
    color: colors.primary,
    fontWeight: '600',
  },

  balanceContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  balanceCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  availableCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },

  waitingCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },

  balanceHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },

  balanceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  balanceLabel: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  availableBalance: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 28,
    color: colors.success,
    marginBottom: 8,
  },

  waitingBalance: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 28,
    color: colors.warning,
    marginBottom: 8,
  },

  balanceCount: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 4,
  },

  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  pixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },

  pixButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },

  payoutCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  payoutStudent: {
    flexDirection: 'row',
    flex: 1,
  },

  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  studentName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 2,
  },

  payoutDate: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
  },

  divider: {
    marginVertical: 16,
    backgroundColor: colors.border,
  },

  payoutAmounts: {
    gap: 12,
  },

  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  amountLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  amountLabel: {
    color: colors.textSecondary,
  },

  feeText: {
    color: colors.error,
  },

  amountDivider: {
    marginTop: 8,
    marginBottom: 8,
  },

  netAmountRow: {
    marginTop: 4,
  },

  netAmountLabel: {
    color: colors.text,
    fontWeight: '600',
  },

  netAmount: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 22,
  },

  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },

  availableIn: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '500',
  },

  payoutActions: {
    gap: 12,
  },

  actionButton: {
    borderRadius: 12,
  },

  actionButtonContent: {
    paddingVertical: 8,
  },

  anticipatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },

  anticipatedText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },

  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    margin: 20,
  },

  dialogTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
  },

  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  modalDescription: {
    textAlign: 'center',
    marginTop: 12,
    color: colors.text,
  },

  modalAmounts: {
    gap: 12,
  },

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalLabel: {
    color: colors.textSecondary,
  },

  modalValue: {
    color: colors.text,
    fontWeight: '600',
  },

  feeBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  feeBadgeText: {
    color: colors.primary,
    fontWeight: '600',
  },

  modalDivider: {
    marginVertical: 12,
    backgroundColor: colors.border,
  },

  modalFinalLabel: {
    color: colors.text,
    fontWeight: '600',
  },

  modalFinalAmount: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 24,
  },

  pixInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  pixDetails: {
    flex: 1,
  },

  modalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.info + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },

  modalNoteText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },

  dialogActions: {
    paddingTop: 0,
  },

  dialogCancel: {
    borderRadius: 8,
  },

  dialogConfirm: {
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
});