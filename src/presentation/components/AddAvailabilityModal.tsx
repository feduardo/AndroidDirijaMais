import React, { useState } from 'react';
import { RadioButton, Chip,Modal, Portal, Button, Text, SegmentedButtons } from 'react-native-paper';
import { colors } from '../theme';
import { CreateAvailabilityPayload } from '../../domain/entities/Availability.entity';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
];

const TIME_PERIODS = {
  morning: {
    label: 'Manhã',
    hours: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
  },
  afternoon: {
    label: 'Tarde',
    hours: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  night: {
    label: 'Noite',
    hours: ['19:00', '20:00', '21:00', '22:00', '23:00'],
  },
};

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (payload: CreateAvailabilityPayload) => Promise<void>;
}

export const AddAvailabilityModal: React.FC<Props> = ({ visible, onDismiss, onConfirm }) => {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleHour = (hour: string) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort()
    );
  };

const handleConfirm = async () => {
  if (selectedHours.length === 0) {
    Alert.alert('Erro', 'Selecione pelo menos um horário');
    return;
  }

  try {
    setLoading(true);
    
    // Agrupar horários contíguos em intervalos
    const intervals = groupContiguousHours(selectedHours);
    
    // Enviar 1 POST por intervalo
    for (const interval of intervals) {
      await onConfirm({
        day_of_week: dayOfWeek,
        start_time: `${interval.start}:00`,
        end_time: `${interval.end}:00`,
      });
    }
    
    setSelectedHours([]);
    onDismiss();
  } catch (error: any) {
    Alert.alert('Erro', error.message || 'Não foi possível adicionar a disponibilidade');
  } finally {
    setLoading(false);
  }
};

const groupContiguousHours = (hours: string[]) => {
  if (!hours.length) return [];

  const sorted = Array.from(new Set(hours)).sort(
    (a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0])
  );

  const intervals = [];
  let start = sorted[0];
  let end = addOneHour(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    if (isContiguous(sorted[i - 1], sorted[i])) {
      end = addOneHour(sorted[i]);
    } else {
      intervals.push({ start, end });
      start = sorted[i];
      end = addOneHour(sorted[i]);
    }
  }

  intervals.push({ start, end });
  return intervals;
};


  const isContiguous = (hour1: string, hour2: string): boolean => {
    const h1 = parseInt(hour1.split(':')[0]);
    const h2 = parseInt(hour2.split(':')[0]);
    return h2 - h1 === 1;
  };

  const addOneHour = (hour: string): string => {
    const h = parseInt(hour.split(':')[0]);
    if (h === 23) return '23:59'; // não cruzar o dia
    return `${String(h + 1).padStart(2, '0')}:00`;
  };


  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Adicionar Disponibilidade</Text>

          <Text style={styles.label}>Dia da semana</Text>
          <RadioButton.Group value={dayOfWeek.toString()} onValueChange={(value) => setDayOfWeek(Number(value))}>
            {DAYS_OF_WEEK.map(day => (
              <View key={day.value} style={styles.radioItem}>
                <RadioButton value={day.value.toString()} />
                <Text>{day.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.sectionTitle}>Selecione os horários disponíveis</Text>

          {Object.entries(TIME_PERIODS).map(([key, period]) => (
            <View key={key} style={styles.periodSection}>
              <Text style={styles.periodLabel}>{period.label}</Text>
              <View style={styles.chipsContainer}>
                {period.hours.map(hour => (
                  <Chip
                    key={hour}
                    selected={selectedHours.includes(hour)}
                    onPress={() => toggleHour(hour)}
                    style={[
                      styles.chip,
                      selectedHours.includes(hour) && styles.chipSelected,
                    ]}
                    mode={selectedHours.includes(hour) ? 'flat' : 'outlined'}
                  >
                    {hour}
                  </Chip>
                ))}
              </View>
            </View>
          ))}

          {selectedHours.length > 0 && (
            <View style={styles.summaryBox}>
              {groupContiguousHours(selectedHours).map((interval, idx) => (
                <Text key={idx} style={styles.summaryText}>
                  Intervalo {idx + 1}: {interval.start} - {interval.end}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <Button mode="outlined" onPress={onDismiss} disabled={loading}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleConfirm} loading={loading}>
              Adicionar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  periodSection: {
    marginBottom: 16,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  chipSelected: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  summaryBox: {
    backgroundColor: colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.success,
  },
  summaryText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});