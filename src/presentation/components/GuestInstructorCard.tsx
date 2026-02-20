// src/presentation/components/GuestInstructorCard.tsx

import React from 'react';
import type { ViewStyle } from 'react-native';
import { View, StyleSheet, TouchableOpacity,Image } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '@/presentation/theme';

interface GuestInstructorCardProps {
  name: string;
  city: string;
  state: string;
  distanceKm?: number;
  style?: ViewStyle;
  onPress?: () => void;
  avatar?: string | null;
}

export const GuestInstructorCard = ({
  name,
  city,
  state,
  avatar,
  distanceKm,
  style,
  onPress,
}: GuestInstructorCardProps) => {

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Instrutor ${name}`}
    >
      <View style={styles.avatar}>
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={64}
            color={colors.primary}
          />
        )}
      </View>


      <Text variant="titleMedium" style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      <View style={styles.row}>
        <MaterialCommunityIcons
          name="map-marker"
          size={16}
          color={colors.primary}
          style={styles.icon}
        />
        <Text variant="bodySmall" style={styles.location}>
          {city} - {state}
        </Text>
      </View>

      {distanceKm !== undefined && (
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={16}
            color={colors.textSecondary}
            style={styles.icon}
          />
          <Text variant="bodySmall" style={styles.distance}>
            {distanceKm.toFixed(1)} km
          </Text>
        </View>
      )}

      <View style={styles.loginPrompt}>
        <Text variant="bodySmall" style={styles.loginText}>
          Faça login para ver detalhes
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 195,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
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
    alignSelf: 'center',
    marginBottom: 12,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  name: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginRight: 5,
  },
  location: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 13,
  },
  distance: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  loginPrompt: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  loginText: {
    color: colors.primaryMid,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});