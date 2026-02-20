import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: colors.primaryLight,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    opacity: 0.8,
  },

  // Section
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text,
  },

  // Progress Chip
  progressChip: {
    backgroundColor: colors.infoLight,
  },
  practiceChip: {
    backgroundColor: colors.primaryLight,
  },

  // Empty State
  emptyCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Progress Card
  progressCard: {
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  progressLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressTopic: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  scoreBadge: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
  },
  scorePercentage: {
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  correctCircle: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)', // success com 10% opacity
  },
  wrongCircle: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)', // error com 10% opacity
  },
  correctText: {
    fontWeight: 'bold',
    color: colors.success,
  },
  wrongText: {
    fontWeight: 'bold',
    color: colors.error,
  },
  statLabel: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: colors.border,
  },

  // Progress Actions
  progressActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyButton: {
    flex: 1,
  },

  // Divider
  divider: {
    marginVertical: 8,
    backgroundColor: colors.border,
    height: 1,
  },

  // Simulado Card
  simuladoCard: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  simuladoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  simuladoBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  questionCount: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  simuladoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  simuladoDescription: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },

  // Topics Container
  topicsContainer: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
  },
  topicsLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  topicChipText: {
    fontSize: 11,
  },
  moreChip: {
    backgroundColor: colors.background,
  },

  // Simulado Actions
  simuladoActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  startButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 6,
  },

  // Subsection
  subsectionTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: colors.text,
  },
  subsectionDescription: {
    color: colors.textSecondary,
    marginBottom: 20,
  },

  // Topics Grid
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topicCardContent: {
    paddingBottom: 8,
  },
  topicName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  topicInfo: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  topicCardActions: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  topicButton: {
    borderColor: colors.primary,
  },

  // Footer
  footerSpace: {
    height: 32,
  },
});