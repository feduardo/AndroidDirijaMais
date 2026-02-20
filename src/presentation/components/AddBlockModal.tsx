import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Modal, Portal, Button, Text, RadioButton, Chip } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { colors } from '../theme';
import { CreateBlockPayload, BLOCK_REASONS } from '../../domain/entities/Availability.entity';

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

type DateSelectionMode = 'today' | 'tomorrow' | 'period';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onConfirm: (payloads: CreateBlockPayload[]) => Promise<void>;
}

export const AddBlockModal: React.FC<Props> = ({ visible, onDismiss, onConfirm }) => {
  const [dateMode, setDateMode] = useState<DateSelectionMode>('today');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [blockType, setBlockType] = useState<'full' | 'partial'>('full');
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [reason, setReason] = useState<string>(BLOCK_REASONS[0]);
  const [loading, setLoading] = useState(false);

  const toggleHour = (hour: string) => {
    setSelectedHours(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDateBR = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const handleDateSelect = (day: DateData) => {
    if (dateMode !== 'period') return;

    const selectedDate = day.dateString;

    if (!startDate) {
      setStartDate(selectedDate);
      setEndDate('');
    } else if (!endDate) {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
      } else {
        setStartDate(selectedDate);
        setEndDate('');
      }
    } else {
      setStartDate(selectedDate);
      setEndDate('');
    }
  };

  const getMarkedDates = () => {
    if (dateMode !== 'period' || !startDate) return {};

    const marked: any = {};

    if (!endDate) {
      marked[startDate] = {
        selected: true,
        color: colors.primary,
      };
    } else {
      const dates = getDatesInRange(startDate, endDate);
      dates.forEach((date, index) => {
        marked[date] = {
          selected: true,
          color: colors.primary,
          startingDay: index === 0,
          endingDay: index === dates.length - 1,
        };
      });
    }

    return marked;
  };

  const handleConfirm = async () => {
    let datesToBlock: string[] = [];

    if (dateMode === 'today') {
      datesToBlock = [getTodayDate()];
    } else if (dateMode === 'tomorrow') {
      datesToBlock = [getTomorrowDate()];
    } else if (dateMode === 'period') {
      if (!startDate || !endDate) {
        Alert.alert('Erro', 'Selecione data inicial e final');
        return;
      }
      datesToBlock = getDatesInRange(startDate, endDate);
      if (datesToBlock.length < 2) {
        Alert.alert('Erro', 'Selecione pelo menos 2 dias');
        return;
      }
    }

    if (blockType === 'partial' && selectedHours.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um horário');
      return;
    }

    try {
      setLoading(true);

      const payloads: CreateBlockPayload[] = [];

      for (const date of datesToBlock) {
        if (blockType === 'full') {
          payloads.push({ block_date: date, reason });
        } else {
          selectedHours.forEach(hour => {
            payloads.push({
              block_date: date,
              start_time: hour,
              end_time: addOneHour(hour),
              reason,
            });
          });
        }
      }

      await onConfirm(payloads);
      resetForm();
      onDismiss();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível adicionar o bloqueio');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDateMode('today');
    setStartDate('');
    setEndDate('');
    setSelectedHours([]);
    setBlockType('full');
  };

  const addOneHour = (time: string): string => {
    const [hour] = time.split(':');
    const nextHour = (parseInt(hour) + 1).toString().padStart(2, '0');
    return `${nextHour}:00`;
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Bloquear Horários</Text>

          <Text style={styles.label}>Selecionar Data</Text>
          <View style={styles.dateButtons}>
            <Button
              mode={dateMode === 'today' ? 'contained' : 'outlined'}
              onPress={() => setDateMode('today')}
              style={styles.dateButton}
            >
              Hoje
            </Button>
            <Button
              mode={dateMode === 'tomorrow' ? 'contained' : 'outlined'}
              onPress={() => setDateMode('tomorrow')}
              style={styles.dateButton}
            >
              Amanhã
            </Button>
            <Button
              mode={dateMode === 'period' ? 'contained' : 'outlined'}
              onPress={() => setDateMode('period')}
              style={styles.dateButton}
            >
              Período
            </Button>
          </View>

          {dateMode === 'today' && (
            <Text style={styles.selectedDate}>Data: {formatDateBR(getTodayDate())}</Text>
          )}

          {dateMode === 'tomorrow' && (
            <Text style={styles.selectedDate}>Data: {formatDateBR(getTomorrowDate())}</Text>
          )}

          {dateMode === 'period' && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={getMarkedDates()}
                markingType="period"
                minDate={getTodayDate()}
                theme={{
                  selectedDayBackgroundColor: colors.primary,
                  todayTextColor: colors.primary,
                  arrowColor: colors.primary,
                }}
              />
              {startDate && endDate && (
                <Text style={styles.periodInfo}>
                  Período: {formatDateBR(startDate)} até {formatDateBR(endDate)} ({getDatesInRange(startDate, endDate).length} dias)
                </Text>
              )}
            </View>
          )}

          <Text style={styles.label}>Tipo de bloqueio</Text>
          <RadioButton.Group value={blockType} onValueChange={(value) => setBlockType(value as any)}>
            <View style={styles.radioItem}>
              <RadioButton value="full" />
              <Text>Dia inteiro</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="partial" />
              <Text>Horários específicos</Text>
            </View>
          </RadioButton.Group>

          {blockType === 'partial' && (
            <>
              {Object.entries(TIME_PERIODS).map(([key, period]) => (
                <View key={key} style={styles.periodSection}>
                  <Text style={styles.periodLabel}>{period.label}</Text>
                  <View style={styles.chipsContainer}>
                    {period.hours.map(hour => (
                      <Chip
                        key={hour}
                        selected={selectedHours.includes(hour)}
                        onPress={() => toggleHour(hour)}
                        style={styles.chip}
                        mode={selectedHours.includes(hour) ? 'flat' : 'outlined'}
                      >
                        {hour}
                      </Chip>
                    ))}
                  </View>
                </View>
              ))}

              {selectedHours.length > 0 && (
                <Text style={styles.selectedInfo}>
                  {selectedHours.length} horário(s) selecionado(s)
                </Text>
              )}
            </>
          )}

          <Text style={styles.label}>Motivo</Text>
          <RadioButton.Group value={reason} onValueChange={setReason}>
            {BLOCK_REASONS.map((r: string) => (
              <View key={r} style={styles.radioItem}>
                <RadioButton value={r} />
                <Text>{r}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={onDismiss} disabled={loading}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleConfirm} loading={loading}>
              Bloquear
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
    marginTop: 16,
    marginBottom: 8,
  },
  dateButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dateButton: {
    flex: 1,
  },
  selectedDate: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 8,
  },
  calendarContainer: {
    marginVertical: 12,
  },
  periodInfo: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  periodSection: {
    marginTop: 16,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
  selectedInfo: {
    marginTop: 12,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});