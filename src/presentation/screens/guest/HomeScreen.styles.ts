import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/presentation/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    elevation: 3,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  locationContainer: {
    marginLeft: 8,
    flex: 1,
  },
  locationLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  locationText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  locationChevron: {
    marginLeft: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 22,
  },

  /* CONTENT */
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  welcome: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '800',
    fontSize: 26,
    paddingHorizontal: 20,
    letterSpacing: -0.5,
    marginTop: 20,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    paddingHorizontal: 20,
    lineHeight: 21,
  },
  searchbar: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 52,
  },
  searchbarInput: {
    fontSize: 15,
  },

  /* QUICK ACTIONS */
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    width: (width - 44) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 19,
  },

  /* INSTRUCTOR SECTION */
  instructorsSection: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  seeAllText: {
    color: colors.primaryMid,
    fontWeight: '600',
    fontSize: 14,
  },
  instructorsList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  instructorCardSpacing: {
    marginRight: 14,
  },

  /* CATEGORIES SECTION */
  categoriesSection: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  categoriesList: {
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    color: colors.text,
    fontWeight: '500',
  },

  /* TIP SECTION */
  tipSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.primaryMid + '25',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipTitle: {
    color: colors.text,
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
  },
});