import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/presentation/theme';

const { width } = Dimensions.get('window');

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

  errorIllustration: {
    marginBottom: 24,
  },

  errorTitle: {
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '600',
  },

  errorText: {
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },

  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  errorButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },

  errorButtonPrimary: {
    backgroundColor: colors.primary,
  },

  errorButtonPrimaryText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 15,
  },

  errorButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorButtonSecondaryText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },

  listContent: {
    paddingBottom: 24,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 8,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },

  title: {
    color: colors.text,
    fontWeight: '800', // Mais peso para destaque
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
    letterSpacing: -0.5, // Melhor legibilidade
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
    textAlign: 'center',
    fontSize: 14, // Ligeiramente menor para hierarquia
    paddingHorizontal: 16,
    marginBottom: 20,
    lineHeight: 20,
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
    borderWidth: 1.5, // Aumentado para mais destaque
    borderColor: colors.border,
    gap: 8,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  filterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Mais sutil quando selecionado
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
    minWidth: 22, // Garantir tamanho consistente
    alignItems: 'center',
  },
  filterChipText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },

  filterChipTextSelected: {
    color: colors.onPrimary,
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
    marginTop: 12,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
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

  studentInfo: {
    flexDirection: 'row',
    flex: 1,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },

  statusIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.surface,
    bottom: 0,
    right: 0,
  },

  studentText: {
    flex: 1,
    justifyContent: 'center',
  },

  studentName: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 17,
    marginBottom: 4,
  },

  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },

  infoBadgeText: {
    color: colors.textSecondary,
    fontSize: 11,
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

  lessonDetails: {
    gap: 12,
    marginBottom: 16,
    paddingLeft: 4,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  detailText: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
  },

  locationText: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
    fontStyle: 'italic',
  },

  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },

  notesText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

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

  actionButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 14,
  },

  statusChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
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
    fontSize: 18,
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
});