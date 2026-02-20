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
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginRight: 12,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  name: {
    color: colors.text,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconSmall: {
    marginRight: 6,
  },
  rating: {
    color: colors.textSecondary,
  },
  category: {
    color: colors.textSecondary,
  },
  price: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
});