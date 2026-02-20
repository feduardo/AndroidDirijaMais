// src/presentation/screens/shared/ReferralScreen.styles.ts

import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  
  content: { 
    padding: 16, 
    paddingBottom: 28 
  },
  
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  cardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.text 
  },

  // Código
  codeBox: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  codeText: { 
    fontSize: 28, 
    fontWeight: '800', 
    letterSpacing: 3, 
    color: colors.primary 
  },

  helperText: { 
    marginTop: 10, 
    color: colors.textSecondary, 
    fontSize: 13,
    lineHeight: 18,
  },

  iconBtn: { 
    padding: 8, 
    borderRadius: 8,
    backgroundColor: colors.background,
  },

  // Progresso
  progressSection: {
    gap: 12,
  },

  progressBarTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.success,
  },

  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Milestones
  milestonesContainer: {
    gap: 8,
    marginTop: 8,
  },

  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },

  milestoneItemActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: colors.success,
  },

  milestoneItemCurrent: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },

  milestoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  milestoneText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },

  milestoneTextCompleted: {
    color: colors.success,
    fontWeight: '600',
  },

  milestoneReward: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  milestoneRewardCompleted: {
    color: colors.success,
  },

  // Saldo
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  balanceLeft: {
    flex: 1,
  },

  balanceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  balanceValue: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: colors.text,
  },

  linkBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },

  linkText: { 
    color: colors.primary, 
    fontWeight: '600',
    fontSize: 13,
  },

  // Lista de indicações
  listItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    flex: 1,
  },

  listText: { 
    flexDirection: 'column',
    flex: 1,
  },

  listEmail: { 
    fontWeight: '600', 
    color: colors.text,
    fontSize: 14,
  },

  listDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  badgeTextCompleted: {
    color: colors.success,
  },

  empty: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // Textos gerais
  muted: { 
    color: colors.textSecondary, 
    fontSize: 13 
  },

  mutedSmall: { 
    color: colors.textSecondary, 
    fontSize: 12 
  },

  // Footer
  footer: {
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 6,
  },

  infoBox: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },

  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
  // src/presentation/screens/shared/ReferralScreen.styles.ts

// Adicione no final do StyleSheet.create, antes do fechamento:

  // Botão aplicar código
  applyCodeButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
  },

  applyCodeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // Modal
  modalContent: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },

  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },

  modalInput: {
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  modalButtonDisabled: {
    backgroundColor: colors.border,
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },


});