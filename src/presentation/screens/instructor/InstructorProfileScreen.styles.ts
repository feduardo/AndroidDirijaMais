import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/presentation/theme/colors';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  
  // Progress
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  progressText: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  
  // Section Card
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.text,
  },
  sectionNote: {
    color: colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  
  // Info Grid (Dados de Contato)
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: (width - 64) / 2 - 8,
  },
  infoLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.text,
    backgroundColor: colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Inputs
  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
  },
  fieldLabel: {
    marginBottom: 12,
    color: colors.text,
    fontWeight: '500',
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flexItem: {
    flex: 1,
  },
  spacer: {
    width: 16,
  },
  stateInput: {
    width: 80,
  },
  
  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  
  // Radio Group
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioLabel: {
    marginLeft: 8,
    color: colors.text,
  },
  
  // Divider & Subsection
  divider: {
    marginVertical: 24,
    backgroundColor: colors.borderLight,
  },
  subsectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  
  // CEP Container
  cepContainer: {
    marginBottom: 16,
  },
  cepHelper: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 12,
  },
  
  // Action Card
  actionCard: {
    margin: 16,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
  },
  actionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.primary,
  },
  actionDescription: {
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
    borderColor: colors.primary,
  },
  
  // Footer
  footerSpace: {
    height: 40,
  },

  // No arquivo InstructorProfileScreen.styles.ts
fieldContainer: {
  marginBottom: 16,
},
fieldValue: {
  color: colors.text,
  backgroundColor: colors.backgroundSecondary,
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: colors.border,
  minHeight: 48,
  justifyContent: 'center',
},
halfField: {
  flex: 1,
},


});