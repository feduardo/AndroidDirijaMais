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
            size={48}
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
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    elevation: 2,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  name: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  icon: {
    marginRight: 6,
  },
  location: {
    color: colors.text,
    flex: 1,
  },
  distance: {
    color: colors.textSecondary,
  },
  loginPrompt: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  loginText: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  avatarImage: {
  width: 48,
  height: 48,
  borderRadius: 24,
},

});