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
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 22,
    flex: 1,
    marginLeft: 8,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    padding: 16,
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

  card: {
    borderRadius: 20,
    backgroundColor: colors.surface,
    elevation: 3,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },

  illustration: {
    alignItems: 'center',
    marginBottom: 16,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 16,
  },

  methodsContainer: {
    gap: 12,
  },

  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },

  methodOptionSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },

  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  methodIconSelected: {
    backgroundColor: colors.primary,
  },

  methodContent: {
    flex: 1,
  },

  methodLabel: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },

  methodLabelSelected: {
    color: colors.primary,
  },

  methodDescription: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  methodDescriptionSelected: {
    color: colors.text,
  },

  pixTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  pixTypeOption: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },

  pixTypeOptionSelected: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },

  pixTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  pixTypeIconSelected: {
    backgroundColor: colors.primary,
  },

  pixTypeContent: {
    flex: 1,
  },

  pixTypeLabel: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2,
  },

  pixTypeLabelSelected: {
    color: colors.primary,
  },

  pixTypeDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 16,
  },

  pixTypeDescriptionSelected: {
    color: colors.text,
  },

  pixInput: {
    backgroundColor: colors.surface,
    fontSize: 16,
  },

  pixInputOutline: {
    borderRadius: 12,
  },

  pixHelper: {
    marginTop: 8,
    fontSize: 14,
  },

  emailInput: {
    backgroundColor: colors.surface,
    fontSize: 16,
  },

  emailInputOutline: {
    borderRadius: 12,
  },

  emailHelper: {
    marginTop: 8,
    fontSize: 14,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },

  errorText: {
    color: colors.error,
    flex: 1,
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 24,
  },

  submitButtonContent: {
    paddingVertical: 12,
  },

  disclaimer: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },
});