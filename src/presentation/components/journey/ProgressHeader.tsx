import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface ProgressHeaderProps {
  progressPercentage: number;
  completedCount: number;
  totalMandatory: number;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  progressPercentage,
  completedCount,
  totalMandatory,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text variant="headlineSmall" style={styles.title}>
          Minha Jornada
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {completedCount} de {totalMandatory} etapas concluídas
        </Text>
      </View>
      
      <ProgressBar
        progress={progressPercentage / 100}
        color={colors.primary}
        style={styles.progressBar}
      />
      
      <Text variant="titleMedium" style={[styles.percentage, { color: colors.primary }]}>
        {progressPercentage}% completo
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  percentage: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});