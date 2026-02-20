import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { journeyRepository } from '../../../infrastructure/repositories/JourneyRepository';
import { JourneyProgress, MilestoneCategory } from '../../../domain/entities/Journey.entity';
import { ProgressHeader } from '../../components/journey/ProgressHeader';
import { CategorySection } from '../../components/journey/CategorySection';

export const JourneyScreen: React.FC = () => {
  const [journey, setJourney] = useState<JourneyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadJourney = async () => {
    try {
      const data = await journeyRepository.getJourney();
      setJourney(data);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível carregar sua jornada'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadJourney();
  }, []);

  const handleStartMilestone = async (id: string) => {
    await journeyRepository.startMilestone(id);
    await loadJourney();
  };

  const handleCompleteMilestone = async (id: string) => {
    await journeyRepository.completeMilestone(id);
    await loadJourney();
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    await journeyRepository.updateMilestoneNotes(id, notes);
    await loadJourney();
  };

const groupMilestonesByCategory = () => {
  const emptyGroup: Record<MilestoneCategory, JourneyProgress['milestones']> = {
    documentation: [],
    medical: [],
    theoretical: [],
    practical: [],
    habilitation: [],
  };

  if (!journey) return emptyGroup;

  const grouped: Record<MilestoneCategory, JourneyProgress['milestones']> = {
    documentation: [],
    medical: [],
    theoretical: [],
    practical: [],
    habilitation: [],
  };

  journey.milestones.forEach((milestone) => {
    grouped[milestone.category].push(milestone);
  });

  return grouped;
};

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando sua jornada...</Text>
      </View>
    );
  }

  if (!journey) {
    return (
      <View style={styles.centerContainer}>
        <Text>Não foi possível carregar sua jornada</Text>
      </View>
    );
  }

  const groupedMilestones = groupMilestonesByCategory();
  const categories: MilestoneCategory[] = ['documentation', 'medical', 'theoretical', 'practical', 'habilitation'];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ProgressHeader
        progressPercentage={journey.progress_percentage}
        completedCount={journey.completed}
        totalMandatory={journey.total_mandatory}
      />

      {categories.map((category) => (
        <CategorySection
          key={category}
          category={category}
          milestones={groupedMilestones[category]}
          onStart={handleStartMilestone}
          onComplete={handleCompleteMilestone}
          onUpdateNotes={handleUpdateNotes}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
});