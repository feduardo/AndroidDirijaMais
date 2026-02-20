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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 17,
  },

  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  headerRight: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },

  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  loadingTitle: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    fontSize: 20,
  },

  loadingText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },

  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  errorTitle: {
    color: colors.error,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    fontSize: 20,
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },

  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },

  secondaryButton: {
    flex: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },

  buttonContent: {
    paddingVertical: 10,
  },

  supportText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },

  webView: {
    flex: 1,
  },

  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  webViewLoadingContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  webViewLoadingText: {
    color: colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});