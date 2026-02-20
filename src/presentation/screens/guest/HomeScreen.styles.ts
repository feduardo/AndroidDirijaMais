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
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    fontSize: 12,
    marginBottom: 2,
  },
  locationText: {
    color: colors.text,
    fontWeight: '600',
  },
  locationChevron: {
    marginLeft: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    fontWeight: '700',
    fontSize: 24,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 15,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    width: (width - 56) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },

  /* INSTRUCTOR SECTION */
  instructorsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  instructorsList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  instructorCardSpacing: {
    marginRight: 16,
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
    marginHorizontal: 20,
    backgroundColor: colors.infoLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.info + '30',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    color: colors.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  tipText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});