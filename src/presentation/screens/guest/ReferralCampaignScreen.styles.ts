// src/presentation/screens/guest/ReferralCampaignScreen.styles.ts

import { StyleSheet } from 'react-native';
import { colors } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 32,
  },

  // Hero Section
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },

  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },

  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
  },

  highlight: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Benefits
  benefitsContainer: {
    padding: 20,
    gap: 12,
  },

  benefitCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  benefitContent: {
    flex: 1,
  },

  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },

  benefitText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  benefitHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  // Milestones
  milestonesSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F5F5F5',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },

  milestonesList: {
    gap: 12,
  },

  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },

  milestoneNumber: {
    alignItems: 'center',
  },

  milestoneCount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },

  milestoneLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  milestoneReward: {
    flex: 1,
    alignItems: 'flex-end',
  },

  rewardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.success,
  },

  rewardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // How it works
  howItWorksSection: {
    padding: 20,
  },

  stepsList: {
    gap: 16,
  },

  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },

  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  stepContent: {
    flex: 1,
    paddingTop: 4,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  stepText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // CTA
  ctaSection: {
    padding: 20,
    gap: 16,
  },

  ctaBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },

  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },

  ctaText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  ctaButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});