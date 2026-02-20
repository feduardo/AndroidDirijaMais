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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 28,
    borderRadius: 16,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 4,
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: -0.5,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 22,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: 12,
    borderRadius: 10,
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
    lineHeight: 20,
  },

  input: {
    marginBottom: 14,
    backgroundColor: colors.surface,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  forgotText: {
    color: colors.primaryMid,
    fontWeight: '600',
    fontSize: 14,
  },

  loginButton: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.shadow.button,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },

  loginButtonDisabled: {
    backgroundColor: colors.disabled,
    elevation: 0,
    shadowOpacity: 0,
  },

  loginButtonContent: {
    paddingVertical: 10,
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
    marginTop: 8,
    alignItems: 'center',
  },

  signupText: {
    color: colors.textSecondary,
    marginRight: 4,
    fontSize: 15,
  },

  signupLink: {
    color: colors.primaryMid,
    fontWeight: '700',
    fontSize: 15,
  },
});