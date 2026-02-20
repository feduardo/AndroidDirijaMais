import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: colors.surface,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 4,
    fontWeight: '700',
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
    fontSize: 16,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },

  errorIcon: {
    marginRight: 8,
  },

  errorText: {
    color: colors.error,
    flex: 1,
    fontSize: 14,
  },

  input: {
    marginBottom: 16,
    backgroundColor: colors.surface,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },

  forgotText: {
    color: colors.primary,
    fontWeight: '600',
  },

  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  loginButtonDisabled: {
    backgroundColor: colors.disabled,
  },

  loginButtonContent: {
    paddingVertical: 8,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  divider: {
    flex: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },

  googleButton: {
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  googleButtonContent: {
    paddingVertical: 8,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    alignItems: 'center',
  },

  signupText: {
    color: colors.textSecondary,
    marginRight: 4,
    fontSize: 15,
  },

  signupLink: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});