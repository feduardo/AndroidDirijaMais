import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import type { Instructor } from '@/domain/entities/Instructor.entity';

interface InstructorListCardProps {
  instructor: Instructor;
  onPress: () => void;
  isGuestMode?: boolean;
}

export const InstructorListCard: React.FC<InstructorListCardProps> = ({
  instructor,
  onPress,
  isGuestMode = false, 
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: instructor.avatar }} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
            {instructor.name}
          </Text>
          {instructor.available && (
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text variant="labelSmall" style={styles.availableText}>
                Disponível
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="star"
            size={16}
            color={colors.warning}
          />
          <Text variant="bodySmall" style={styles.infoText}>
            {instructor.rating.toFixed(1)}
          </Text>

          <MaterialCommunityIcons
            name="car-outline"
            size={16}
            color={colors.primary}
            style={styles.iconSpacing}
          />
          <Text variant="bodySmall" style={styles.infoText}>
            Cat. {instructor.category}
          </Text>

          {instructor.experience && (
            <>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={colors.textSecondary}
                style={styles.iconSpacing}
              />
              <Text variant="bodySmall" style={styles.infoText}>
                {instructor.experience} anos
              </Text>
            </>
          )}
        </View>

        {instructor.specialties && instructor.specialties.length > 0 && (
          <View style={styles.specialtiesRow}>
            {instructor.specialties.slice(0, 2).map((specialty, index) => (
              <Chip
                key={index}
                mode="outlined"
                compact
                style={styles.chip}
                textStyle={styles.chipText}
              >
                {specialty}
              </Chip>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {!isGuestMode && (
            <Text variant="titleMedium" style={styles.price}>
              R$ {instructor.pricePerHour}/h
            </Text>
          )}
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  name: {
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 4,
  },

  availableText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '600',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoText: {
    color: colors.textSecondary,
    marginLeft: 4,
  },

  iconSpacing: {
    marginLeft: 12,
  },

  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },

  chip: {
    height: 24,
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: colors.background,
  },

  chipText: {
    fontSize: 11,
    marginVertical: 0,
    marginHorizontal: 8,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  price: {
    color: colors.primary,
    fontWeight: '700',
  },
});