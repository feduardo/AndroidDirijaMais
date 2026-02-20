import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';

interface BlurredContentProps {
  children: React.ReactNode;
}

export const BlurredContent: React.FC<BlurredContentProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.blurred}>{children}</View>
      <View style={styles.overlay}>
        <MaterialCommunityIcons
          name="lock"
          size={14}
          color={colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  blurred: {
    opacity: 0.2,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});