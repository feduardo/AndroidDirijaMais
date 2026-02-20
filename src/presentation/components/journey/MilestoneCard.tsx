import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Card, Text, Button, IconButton, useTheme } from 'react-native-paper';
import { Milestone, MilestoneStatus } from '../../../domain/entities/Journey.entity';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { milestoneDetails } from '../../../shared/content/milestones/milestoneDetails';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { StudentStackParamList } from '../../navigation/StudentStack';
import { colors as appColors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

interface MilestoneCardProps {
  milestone: Milestone;
  onStart: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onStart,
  onComplete,
  onUpdateNotes,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [noteText, setNoteText] = useState(milestone.notes || '');

  const detail = milestoneDetails[milestone.code];

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return { name: 'check-circle', color: colors.primary };
      case 'in_progress':
        return { name: 'play-circle', color: colors.secondary };
      case 'pending':
        return { name: 'clock-outline', color: '#999' };
    }
  };

  const getStatusText = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em andamento';
      case 'pending':
        return 'Pendente';
    }
  };

  const handleAction = async () => {
    setLoading(true);
    try {
      if (milestone.status === 'pending') {
        await onStart(milestone.id);
      } else if (milestone.status === 'in_progress') {
        await onComplete(milestone.id);
      }
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Não foi possível realizar a ação'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNoteModal = () => {
    setNoteText(milestone.notes || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    try {
      await onUpdateNotes(milestone.id, noteText);
      setShowNoteModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a observação');
    }
  };

  const handleFindInstructor = () => {
    setShowInfoModal(false);
    navigation.navigate('InstructorsList');
  };

  const statusIcon = getStatusIcon(milestone.status);

  return (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name={statusIcon.name as any}
                size={24}
                color={statusIcon.color}
              />
              <View style={styles.titleContainer}>
                <Text variant="titleMedium" style={styles.title}>
                  {milestone.name}
                  {milestone.is_mandatory && (
                    <Text style={styles.mandatory}> *</Text>
                  )}
                </Text>
                <Text variant="bodySmall" style={styles.status}>
                  {getStatusText(milestone.status)}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              {detail && (
                <IconButton
                  icon="help-circle"
                  size={20}
                  onPress={() => setShowInfoModal(true)}
                  iconColor={colors.primary}
                />
              )}
              {milestone.status !== 'pending' && (
                <IconButton
                  icon="note-text"
                  size={20}
                  onPress={handleOpenNoteModal}
                />
              )}
            </View>
          </View>

          <Text variant="bodyMedium" style={styles.description}>
            {milestone.description}
          </Text>

          {milestone.notes && (
            <View style={styles.notesContainer}>
              <Text variant="bodySmall" style={styles.notesLabel}>
                Observação:
              </Text>
              <Text variant="bodySmall" style={styles.notes}>
                {milestone.notes}
              </Text>
            </View>
          )}

          {milestone.status !== 'completed' && (
            <Button
              mode="contained"
              onPress={handleAction}
              loading={loading}
              disabled={loading}
              style={styles.actionButton}
            >
              {milestone.status === 'pending' ? 'Iniciar' : 'Concluir'}
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* Modal de Observação */}
      <Modal
        visible={showNoteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Adicionar Observação
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Digite sua observação..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowNoteModal(false)}
                style={styles.modalButton}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveNote}
                style={styles.modalButton}
              >
                Salvar
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Saiba Mais */}
      {detail && (
        <Modal
          visible={showInfoModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.infoModalOverlay}>
            <View style={styles.infoModalContent}>
              <View style={styles.infoModalHeader}>
                <Text variant="headlineSmall" style={styles.infoModalTitle}>
                  {detail.title}
                </Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setShowInfoModal(false)}
                />
              </View>

              <ScrollView style={styles.infoScrollView} showsVerticalScrollIndicator={false}>
                <Text variant="bodyLarge" style={styles.infoDescription}>
                  {detail.description}
                </Text>

                {detail.estimatedTime && (
                  <View style={styles.infoDetailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primary} />
                    <View style={styles.infoDetailText}>
                      <Text variant="labelMedium" style={styles.infoLabel}>Tempo Estimado</Text>
                      <Text variant="bodyMedium">{detail.estimatedTime}</Text>
                    </View>
                  </View>
                )}

                {detail.cost && (
                  <View style={styles.infoDetailRow}>
                    <MaterialCommunityIcons name="cash" size={20} color={appColors.success} />
                    <View style={styles.infoDetailText}>
                      <Text variant="labelMedium" style={styles.infoLabel}>Custo</Text>
                      <Text variant="bodyMedium">{detail.cost}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.tipsContainer}>
                  <Text variant="titleMedium" style={styles.tipsTitle}>
                    📋 Dicas Importantes
                  </Text>
                  {detail.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text variant="bodyMedium" style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>

                {detail.hasInstructorSearch && (
                  <TouchableOpacity
                    style={styles.instructorButton}
                    onPress={handleFindInstructor}
                  >
                    <MaterialCommunityIcons name="magnify" size={20} color="#FFFFFF" />
                    <Text style={styles.instructorButtonText}>
                      Encontre seu Instrutor Aqui
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              <Button
                mode="contained"
                onPress={() => setShowInfoModal(false)}
                style={styles.closeButton}
              >
                Fechar
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  titleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  mandatory: {
    color: '#e74c3c',
  },
  status: {
    color: '#666',
    marginTop: 2,
  },
  description: {
    color: '#444',
    marginBottom: 12,
  },
  notesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  notesLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notes: {
    color: '#666',
  },
  actionButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    marginBottom: 16,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    minWidth: 100,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  infoModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoModalTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  infoScrollView: {
    paddingHorizontal: 20,
  },
  infoDescription: {
    color: '#444',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  infoDetailText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: '#666',
    marginBottom: 2,
  },
  tipsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  tipText: {
    flex: 1,
    color: '#444',
    lineHeight: 22,
  },
  instructorButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  instructorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    marginHorizontal: 20,
    marginTop: 16,
  },
});