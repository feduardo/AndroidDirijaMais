import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Milestone, MilestoneCategory } from '../../../domain/entities/Journey.entity';
import { MilestoneCard } from './MilestoneCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface CategorySectionProps {
  category: MilestoneCategory;
  milestones: Milestone[];
  onStart: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
}

const categoryConfig: Record<MilestoneCategory, { title: string; icon: string; color: string }> = {
  documentation: {
    title: 'Documentação',
    icon: 'file-document',
    color: '#3498db',
  },
  medical: {
    title: 'Exames Médicos',
    icon: 'hospital-box',
    color: '#e74c3c',
  },
  theoretical: {
    title: 'Parte Teórica',
    icon: 'book-open-variant',
    color: '#9b59b6',
  },
  practical: {
    title: 'Parte Prática',
    icon: 'car',
    color: '#f39c12',
  },
  habilitation: {
    title: 'Habilitação',
    icon: 'card-account-details',
    color: '#27ae60',
  },
};

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  milestones,
  onStart,
  onComplete,
  onUpdateNotes,
}) => {
  const { colors } = useTheme();
  const config = categoryConfig[category];

  if (milestones.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={config.icon as any}
          size={24}
          color={config.color}
        />
        <Text variant="titleLarge" style={[styles.title, { color: config.color }]}>
          {config.title}
        </Text>
      </View>

      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          onStart={onStart}
          onComplete={onComplete}
          onUpdateNotes={onUpdateNotes}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
});