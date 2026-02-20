import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },

  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 16,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },

  errorTitle: {
    color: colors.error,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 20,
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },

  errorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  errorButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 16,
  },

  listContent: {
    paddingBottom: 24,
  },

  separator: {
    height: 12,
  },

  /* Header Styles */
  header: {
    backgroundColor: colors.surface,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },

  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 24,
  },

  refreshButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  subtitle: {
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 15,
  },

  counterContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  counterText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 20,
  },

  filtersScrollContainer: {
    marginHorizontal: 16,
  },

  filtersContent: {
    paddingRight: 16,
    gap: 8,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },

  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterChipText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },

  filterChipTextSelected: {
    color: colors.onPrimary,
  },

  filterCount: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },

  filterCountText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },

  filterCountTextSelected: {
    color: colors.primary,
  },

  /* Card Styles */
  cardTouchable: {
    marginHorizontal: 16,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  instructorInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
  },

  statusDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
    bottom: 2,
    right: 2,
  },

  instructorText: {
    flex: 1,
    justifyContent: 'center',
  },

  instructorName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },

  category: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Details Container */
  detailsContainer: {
    gap: 12,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailTextContainer: {
    flex: 1,
  },

  detailLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },

  detailText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },

  locationText: {
    color: colors.text,
    fontSize: 15,
    fontStyle: 'italic',
  },

  timeChip: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
  },

  timeChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  /* Start Code Container */
  startCodeContainer: {
    backgroundColor: colors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.info + '20',
  },

  startCodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  startCodeTitle: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },

  startCodeDisplay: {
    alignItems: 'center',
  },

  startCode: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 32,
    letterSpacing: 4,
    marginBottom: 4,
  },

  startCodeHint: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },

  /* Footer Styles */
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  priceLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },

  price: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 20,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },

  actionButtonPending: {
    backgroundColor: colors.warning,
  },

  actionButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 14,
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },

  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  emptyTitle: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  showAllButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  showAllText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  
  actionButtonEvaluated: {
    backgroundColor: '#4CAF50', // Verde para indicar "completo"
    opacity: 0.9,
  },

  modal: {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 12,
},
modalTitle: {
  marginBottom: 8,
  fontWeight: '600',
},
modalDescription: {
  marginBottom: 16,
  color: colors.textSecondary,
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
reasonInput: {
  marginTop: 8,
},
modalActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  gap: 12,
},

});