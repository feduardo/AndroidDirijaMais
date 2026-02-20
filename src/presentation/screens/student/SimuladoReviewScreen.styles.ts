import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: 8,
  },
  
  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  
  // Summary Card
  summaryCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  simuladoTitle: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicChip: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
  },
  topicChipText: {
    fontSize: 12,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scoreText: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: colors.borderLight,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctText: {
    fontWeight: 'bold',
    color: colors.success,
  },
  wrongText: {
    fontWeight: 'bold',
    color: colors.error,
  },
  totalText: {
    fontWeight: 'bold',
    color: colors.info,
  },
  statLabel: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 10,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.borderLight,
  },
  
  // Performance
  performanceContainer: {
    marginTop: 16,
  },
  performanceLabel: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  
  // Navigation
  navigationSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  questionIndicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  questionIndicator: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  correctIndicator: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: colors.success,
  },
  wrongIndicator: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    borderColor: colors.error,
  },
  
  // Questions Section
  questionsSection: {
    padding: 16,
    paddingTop: 0,
  },
  
  // Question Card
  questionCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  correctCard: {
    borderLeftWidth: 6,
    borderLeftColor: colors.success,
  },
  wrongCard: {
    borderLeftWidth: 6,
    borderLeftColor: colors.error,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontWeight: 'bold',
    color: colors.text,
  },
  resultChip: {
    height: 28,
  },
  resultChipText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionTopicChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
  },
  questionTopicText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statementContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statement: {
    lineHeight: 24,
    color: colors.text,
  },
  questionDivider: {
    marginBottom: 16,
    backgroundColor: colors.borderLight,
  },
  
  // Alternatives
  alternativesContainer: {
    gap: 12,
  },
  alternativesTitle: {
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  alternativeContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  correctAlternativeContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderColor: colors.success,
  },
  wrongAlternativeContainer: {
    backgroundColor: 'rgba(229, 57, 53, 0.08)',
    borderColor: colors.error,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alternativeMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  neutralMarker: {
    backgroundColor: colors.border,
  },
  correctMarker: {
    backgroundColor: colors.success,
  },
  wrongMarker: {
    backgroundColor: colors.error,
  },
  markerText: {
    color: colors.onPrimary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  correctMarkerText: {
    color: colors.onPrimary,
  },
  wrongMarkerText: {
    color: colors.onPrimary,
  },
  alternativeLabels: {
    flexDirection: 'row',
    gap: 8,
  },
  correctLabel: {
    backgroundColor: colors.success,
  },
  wrongLabel: {
    backgroundColor: colors.error,
  },
  labelText: {
    color: colors.onPrimary,
    fontSize: 10,
  },
  alternativeText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  correctAlternativeText: {
    fontWeight: '600',
    color: colors.success,
  },
  wrongAlternativeText: {
    fontWeight: '600',
    color: colors.error,
  },
  
  // Footer
  footer: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  newSimuladoButton: {
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  historyButton: {
    borderRadius: 8,
    borderColor: colors.primary,
  },
});