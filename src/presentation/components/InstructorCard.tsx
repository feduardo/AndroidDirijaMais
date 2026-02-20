import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import { BlurredContent } from './BlurredContent';

interface InstructorCardProps {
  name: string;
  category: string;
  rating: number;
  pricePerHour: number;
  avatar: string;
  style?: ViewStyle;
  onPress?: () => void;
  isGuestMode?: boolean;
}

const InstructorCard = ({
  name,
  category,
  rating,
  pricePerHour,
  avatar,
  style,
  onPress,
  isGuestMode = false,
}: InstructorCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Abrir perfil do instrutor ${name}`}
    >
      <Image source={{ uri: avatar }} style={styles.avatar} />
      
      <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="star"
          size={16}
          color={colors.warning}
          style={styles.iconSmall}
        />
        <Text variant="bodySmall" style={styles.rating}>
          {rating.toFixed(1)}
        </Text>
      </View>
      
      <View style={styles.row}>
        <MaterialCommunityIcons
          name="car-outline"
          size={16}
          color={colors.primary}
          style={styles.iconSmall}
        />
        <Text variant="bodySmall" style={styles.category}>
          Categoria {category}
        </Text>
      </View>
      
      {!isGuestMode && (
        <Text variant="bodyMedium" style={styles.price}>
          R$ {pricePerHour}/h
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default InstructorCard;

const styles = StyleSheet.create({
  card: {
    width: 210,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    elevation: 3,
    shadowColor: 'rgba(17, 24, 39, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 10,
    backgroundColor: colors.primaryLight,
  },
  name: {
    color: colors.text,
    marginBottom: 6,
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconSmall: {
    marginRight: 5,
  },
  rating: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  category: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  price: {
    color: colors.primaryMid,
    fontWeight: '700',
    marginTop: 10,
    fontSize: 15,
  },
});