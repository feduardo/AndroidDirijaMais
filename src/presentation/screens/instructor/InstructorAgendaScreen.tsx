import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, Chip, IconButton, SegmentedButtons } from 'react-native-paper';
import { colors } from '../../theme';
import { availabilityRepository } from '../../../infrastructure/repositories/AvailabilityRepository';
import { InstructorAvailability, InstructorBlock, CreateAvailabilityPayload, CreateBlockPayload } from '../../../domain/entities/Availability.entity';
import { AddAvailabilityModal } from '../../components/AddAvailabilityModal';
import { AddBlockModal } from '../../components/AddBlockModal';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const InstructorAgendaScreen = () => {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<InstructorAvailability[]>([]);
  const [blocks, setBlocks] = useState<InstructorBlock[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'availability' | 'blocks'>('availability');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [availabilityData, blocksData] = await Promise.all([
        availabilityRepository.getAvailability(),
        availabilityRepository.getBlocks(),
      ]);
      setAvailability(availabilityData);
      setBlocks(blocksData);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível carregar a agenda');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAvailability = async (payload: CreateAvailabilityPayload) => {
    await availabilityRepository.createAvailability(payload);
    await loadData();
  };

  const handleDeleteAvailability = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente remover este horário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await availabilityRepository.deleteAvailability(id);
              await loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível remover o horário');
            }
          },
        },
      ]
    );
  };

  const handleCreateBlock = async (payloads: CreateBlockPayload[]) => {
    for (const payload of payloads) {
      await availabilityRepository.createBlock(payload);
    }
    await loadData();
  };

  const handleDeleteBlock = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente remover este bloqueio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await availabilityRepository.deleteBlock(id);
              await loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Não foi possível remover o bloqueio');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
          buttons={[
            {
              value: 'availability',
              label: 'Disponibilidades',
              icon: 'calendar-check',
            },
            {
              value: 'blocks',
              label: 'Bloqueios',
              icon: 'calendar-remove',
            },
          ]}
          style={styles.tabs}
        />

        <ScrollView style={styles.content}>
          {activeTab === 'availability' ? (
            <View style={styles.section}>
              {availability.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma disponibilidade configurada</Text>
              ) : (
                availability.filter(item => item.is_active).map(item => (
                  <View key={item.id} style={styles.availabilityCard}>
                    <View style={styles.availabilityInfo}>
                      <Text style={styles.dayText}>{DAYS_OF_WEEK[item.day_of_week]}</Text>
                      <Text style={styles.timeText}>
                        {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                      </Text>
     
                    </View>
                    <IconButton
                      icon="delete"
                      iconColor={colors.error}
                      onPress={() => handleDeleteAvailability(item.id)}
                    />
                  </View>
                ))
              )}
              <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => setShowAvailabilityModal(true)}
              >
                Adicionar Disponibilidade
              </Button>
            </View>
          ) : (
            <View style={styles.section}>
              {blocks.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum bloqueio configurado</Text>
              ) : (
                blocks.map(block => (
                  <View key={block.id} style={styles.blockCard}>
                    <View style={styles.blockInfo}>
                      <Text style={styles.blockDate}>{block.block_date}</Text>
                      <Text style={styles.blockReason}>{block.reason}</Text>
                      {block.start_time && block.end_time ? (
                        <Text style={styles.blockTime}>
                          {block.start_time.substring(0, 5)} - {block.end_time.substring(0, 5)}
                        </Text>
                      ) : (
                        <Text style={styles.blockTime}>Dia inteiro</Text>
                      )}
                    </View>
                    <IconButton
                      icon="delete"
                      iconColor={colors.error}
                      onPress={() => handleDeleteBlock(block.id)}
                    />
                  </View>
                ))
              )}
              <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => setShowBlockModal(true)}
              >
                Bloquear Horários
              </Button>
            </View>
          )}
        </ScrollView>
      </View>

      <AddAvailabilityModal
        visible={showAvailabilityModal}
        onDismiss={() => setShowAvailabilityModal(false)}
        onConfirm={handleCreateAvailability}
      />

      <AddBlockModal
        visible={showBlockModal}
        onDismiss={() => setShowBlockModal(false)}
        onConfirm={handleCreateBlock}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    margin: 16,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 32,
    fontSize: 16,
  },
  availabilityCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    width: 50,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  statusChip: {
    height: 28,
  },
  blockCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockInfo: {
    flex: 1,
  },
  blockDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  blockReason: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  blockTime: {
    fontSize: 12,
    color: colors.primary,
  },
  addButton: {
    marginTop: 16,
  },
});