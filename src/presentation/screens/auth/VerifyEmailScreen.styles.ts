import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: 'bold',
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 8, 
    color: colors.text,
    fontWeight: '700',
  },
  subtitle: { 
    textAlign: 'center', 
    marginBottom: 4, 
    color: colors.textSecondary,
    fontSize: 16,
  },
  emailText: {
    textAlign: 'center',
    marginBottom: 32,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  digitContainer: {
    alignItems: 'center',
    width: 70,
  },
  digitInput: {
    width: 60,
    height: 60,
    fontSize: 24,
    backgroundColor: colors.surface,
  },
  digitLabel: {
    position: 'absolute',
    bottom: -20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitLabelFilled: {
    backgroundColor: colors.primary,
  },
  digitLabelText: {
    color: colors.onPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  codeHint: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 32,
    fontSize: 14,
  },
  primaryBtn: { 
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: colors.disabled,
  },
  primaryBtnContent: {
    paddingVertical: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  link: { 
    color: colors.primary, 
    fontWeight: '700',
    fontSize: 15,
  },
  linkDisabled: {
    color: colors.disabled,
  },
  backContainer: {
    alignSelf: 'center',
    padding: 12,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 15,
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
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  error: { 
    color: colors.error, 
    flex: 1,
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  infoIcon: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  info: { 
    color: colors.primary, 
    flex: 1,
    fontSize: 14,
  },
});