import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, Button, TextInput, Chip, Card, ActivityIndicator } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import type { Instructor } from '@/domain/entities/Instructor.entity';
import httpClient from '@/infrastructure/http/client';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StudentStackParamList } from '@/presentation/navigation/StudentStack';
type NavigationProp = StackNavigationProp<StudentStackParamList>;

interface RequestLessonFormProps {
  instructor: Instructor;
  onSubmit: (data: RequestLessonData) => void;
  onCancel: () => void;
}

export interface RequestLessonData {
  date: Date;
  time: string;
  duration: number;
  location: string;
  categoryWanted: string;
  useStudentVehicle: boolean;
}

const DURATION_OPTIONS = [
  { value: 1, label: '1 aula', minutes: 50 },
  { value: 2, label: '2 aulas', minutes: 100 },
  { value: 3, label: '3 aulas', minutes: 150 },
  { value: 4, label: '4 aulas', minutes: 200 },
];

const groupHours = (hours: string[]) => {
  const groups: Record<string, string[]> = { Manhã: [], Tarde: [], Noite: [] };

  hours.forEach(h => {
    const hour = parseInt(h.split(':')[0], 10);
    if (hour >= 5 && hour < 12) groups.Manhã.push(h);
    else if (hour >= 12 && hour < 18) groups.Tarde.push(h);
    else if (hour >= 18) groups.Noite.push(h);
  });

  return groups;
};

export const RequestLessonForm: React.FC<RequestLessonFormProps> = ({
  instructor,
  onSubmit,
  onCancel,
}) => {
  const navigation = useNavigation<NavigationProp>(); 
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const duration = 1; // ← FIXO: sempre 1 aula (50 minutos)
  const [location, setLocation] = useState('');
  const [categoryWanted, setCategoryWanted] = useState('B');
  const [useStudentVehicle, setUseStudentVehicle] = useState(false);
  const [studentAddress, setStudentAddress] = useState<any>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [loadingHours, setLoadingHours] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadAddress = async () => {
      setLoadingAddress(true);
      try {
        const res = await httpClient.get('/api/v1/students/addresses');
        const primary = res.data.find((a: any) => a.is_primary);
        if (primary) {
          setStudentAddress(primary);
          setLocation(`${primary.street}, ${primary.number}, ${primary.city}`);
        }
      } catch (error) {
        console.error('Erro ao carregar endereço:', error);
      } finally {
        setLoadingAddress(false);
      }
    };

    loadAddress();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const loadAvailability = async () => {
      setLoadingHours(true);
      try {
        const res = await httpClient.get(
          '/api/v1/instructor/availability/public',
          {
            params: {
              instructor_id: instructor.id,
              date: selectedDate,
            },
          }
        );
        setAvailableHours(res.data.hours || []);
        setSelectedHour(null);
      } catch (error) {
        console.error('Erro ao carregar horários:', error);
        setAvailableHours([]);
      } finally {
        setLoadingHours(false);
      }
    };

    loadAvailability();
  }, [selectedDate, instructor.id]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
    setCalendarOpen(false);
    // Animação ao selecionar data
    Animated.spring(fadeAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const calculateTotal = () => instructor.pricePerHour * duration;

  const getDurationMinutes = () =>
    DURATION_OPTIONS.find(o => o.value === duration)?.minutes || 50;

  const parseLocalDate = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  return new Date(y, m - 1, d); // cria data em horário local (sem UTC)
  };

  const groupedHours = groupHours(availableHours);

  const isFormValid =
    selectedDate &&
    selectedHour &&
    location.trim() &&
    categoryWanted;

  const showSummary =
    !!selectedDate &&
    !!selectedHour &&
    !!studentAddress &&
    (useStudentVehicle === true || useStudentVehicle === false);

  const getCurrentStep = () => {
    if (!selectedDate) return 1;
    if (!selectedHour) return 1;
    if (!location) return 2;
    return 3;
  };

  const handleSubmit = async () => {
    if (!isFormValid || !selectedHour) return;

    setSubmitting(true);
    try {
      // Monta dados do booking
      const bookingData = {
        date: parseLocalDate(selectedDate),
        time: selectedHour,
        duration,
        location: location.trim(),
        categoryWanted,
        useStudentVehicle,
      };

      // Chama callback (que está no InstructorDetailScreen)
      await onSubmit(bookingData);
      
      // onSubmit já vai criar o booking e navegar para Payment
      // Não precisa fazer nada aqui
    } catch (error) {
      console.error('Erro ao criar booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: 'Data', icon: 'calendar', active: !!selectedDate },
      { id: 2, label: 'Horário', icon: 'clock', active: !!selectedHour },
      { id: 3, label: 'Local', icon: 'map-marker', active: !!location },
      { id: 4, label: 'Veículo', icon: 'car', active: true },
    ];
      

    return (
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              step.active && styles.stepCircleActive
            ]}>
              <MaterialCommunityIcons
                name={step.icon as any}
                size={16}
                color={step.active ? '#fff' : '#999'}
              />
            </View>
            <Text style={[
              styles.stepLabel,
              step.active && styles.stepLabelActive
            ]}>
              {step.label}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                step.active && styles.stepLineActive
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            Agendar Aula
          </Text>
          <Text style={styles.instructorName}>
            com {instructor.name}
          </Text>
        </View>

        {renderStepIndicator()}


        {/* DATA */}
        <Text style={styles.sectionTitle}>Selecionar Data</Text>
        <Card style={styles.card} elevation={2}>
          <TouchableOpacity 
            onPress={() => setCalendarOpen(!calendarOpen)}
            style={styles.dateSelector}
          >
            <View style={styles.row}>
              <MaterialCommunityIcons 
                name="calendar" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.dateInfo}>
                <Text style={styles.dateLabel}>Data da aula</Text>
                <Text style={styles.dateValue}>
                  {selectedDate
                    ? parseLocalDate(selectedDate).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Selecione uma data'}
                </Text>
              </View>
              <MaterialCommunityIcons 
                name={calendarOpen ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#666" 
              />
            </View>
          </TouchableOpacity>

          {calendarOpen && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  selectedDayBackgroundColor: colors.primary,
                  todayTextColor: colors.primary,
                  arrowColor: colors.primary,
                }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: colors.primary,
                  }
                }}
              />
            </View>
          )}
        </Card>

        {/* HORÁRIOS */}
        {selectedDate && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
              {loadingHours && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
            
            {loadingHours ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Carregando horários...</Text>
              </View>
            ) : availableHours.length > 0 ? (
              Object.entries(groupedHours).map(
                ([label, hours]) =>
                  hours.length > 0 && (
                    <View key={label} style={styles.period}>
                      <View style={styles.periodHeader}>
                        <MaterialCommunityIcons 
                          name={
                            label === 'Manhã' ? 'weather-sunny' :
                            label === 'Tarde' ? 'weather-sunset' :
                            'weather-night'
                          } 
                          size={18} 
                          color="#666" 
                        />
                        <Text style={styles.periodLabel}>{label}</Text>
                      </View>
                      <View style={styles.chipsRow}>
                        {hours.map(h => (
                          <TouchableOpacity
                            key={h}
                            style={[
                              styles.hourChip,
                              selectedHour === h && styles.hourChipSelected,
                            ]}
                            onPress={() => setSelectedHour(h)}
                          >
                            <Text style={[
                              styles.hourChipText,
                              selectedHour === h && styles.hourChipTextSelected,
                            ]}>
                              {h}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )
              )
            ) : (
              <Card style={[styles.card, styles.emptyCard]}>
                <MaterialCommunityIcons name="calendar-remove" size={32} color="#999" />
                <Text style={styles.emptyText}>
                  Não há horários disponíveis para esta data
                </Text>
              </Card>
            )}
          </>
        )}

        {/* LOCAL */}
        <Text style={styles.sectionTitle}>Local de Início</Text>
        <Card style={styles.card}>
          <View style={styles.locationHeader}>
            <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
            <Text style={styles.locationTitle}>Endereço Principal</Text>
          </View>
          
          {loadingAddress ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : studentAddress ? (
            <View style={styles.addressContainer}>
              <View style={styles.addressBadge}>
                <Text style={styles.addressBadgeText}>PRINCIPAL</Text>
              </View>
              <Text style={styles.addressText}>
                {studentAddress.street}, {studentAddress.number}
              </Text>
              <Text style={styles.addressDetail}>
                {studentAddress.neighborhood || ''} • {studentAddress.city} - {studentAddress.state}
              </Text>
            </View>
          ) : (
            <View style={styles.noAddressContainer}>
              <MaterialCommunityIcons name="home-alert" size={24} color="#999" />
              <Text style={styles.noAddressText}>
                Nenhum endereço cadastrado
              </Text>
            </View>
          )}
        </Card>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('StudentProfile')} 
          style={styles.leftButton}
          icon="plus-circle"
        >
          Cadastrar endereço
        </Button>

        {/* VEÍCULO */}
        <Text style={styles.sectionTitle}>Veículo para a Aula</Text>
        <View style={styles.vehicleContainer}>
          <TouchableOpacity
            style={[
              styles.vehicleOption,
              !useStudentVehicle && styles.vehicleOptionSelected,
            ]}
            onPress={() => setUseStudentVehicle(false)}
          >
            <View style={styles.vehicleIconContainer}>
              <MaterialCommunityIcons 
                name="car-estate" 
                size={28} 
                color={!useStudentVehicle ? colors.primary : '#666'} 
              />
            </View>
            <Text style={styles.vehicleTitle}>Veículo do Instrutor</Text>
            <Text style={styles.vehicleDescription}>
              Inclui seguro e combustível
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.vehicleOption,
              useStudentVehicle && styles.vehicleOptionSelected,
            ]}
            onPress={() => setUseStudentVehicle(true)}
          >
            <View style={styles.vehicleIconContainer}>
              <MaterialCommunityIcons 
                name="car" 
                size={28} 
                color={useStudentVehicle ? colors.primary : '#666'} 
              />
            </View>
            <Text style={styles.vehicleTitle}>Meu Veículo</Text>
            <Text style={styles.vehicleDescription}>
              Prática no seu próprio carro
            </Text>
          </TouchableOpacity>
        </View>

        {/* RESUMO */}
        {showSummary && (
          <>
            <Text style={styles.sectionTitle}>Resumo da Aula</Text>
            <Card style={[styles.card, styles.summaryCard]}>
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#666" />
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Data</Text>
                  <Text style={styles.summaryValue}>
                    {parseLocalDate(selectedDate).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Horário</Text>
                  <Text style={styles.summaryValue}>{selectedHour}</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="timer" size={20} color="#666" />
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Duração</Text>
                  <Text style={styles.summaryValue}>{getDurationMinutes()} minutos</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="cash" size={20} color="#666" />
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Valor Total</Text>
                  <Text style={styles.totalValue}>
                    R$ {calculateTotal().toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* AÇÕES */}
        <View style={styles.actionsRow}>
          <Button
            mode="outlined"
            onPress={onCancel}
            style={styles.actionButton}
            disabled={submitting}
          >
            Cancelar
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!showSummary || submitting}
            style={[styles.actionButton, styles.primaryAction]}
            loading={submitting}
            icon="send-check"
          >
            {submitting ? 'Enviando...' : 'Solicitar Aula'}
          </Button>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 24,
  },
  title: { 
    fontWeight: '700', 
    fontSize: 28,
    color: '#1a1a1a',
  },
  instructorName: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    left: '60%',
    right: '-40%',
    height: 2,
    backgroundColor: '#e0e0e0',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  sectionTitle: { 
    fontWeight: '600', 
    fontSize: 16,
    marginTop: 24, 
    marginBottom: 12,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  card: { 
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  dateSelector: {
    paddingVertical: 4,
  },
  dateInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  calendarContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  period: {
    marginBottom: 20,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  periodLabel: { 
    fontWeight: '600', 
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  chipsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8,
  },
  hourChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  hourChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hourChipText: {
    color: '#333',
    fontWeight: '500',
  },
  hourChipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  leftButton: { 
    alignSelf: 'flex-start', 
    paddingLeft: 0,
    marginTop: -4,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row', 
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
  },
  primaryAction: {
    backgroundColor: colors.primary,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  addressContainer: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  addressBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  addressBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  addressDetail: {
    fontSize: 13,
    color: '#666',
  },
  noAddressContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noAddressText: {
    marginTop: 8,
    color: '#999',
    textAlign: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 12,
    color: '#666',
    textAlign: 'center',
  },
  vehicleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  vehicleOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  vehicleOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  vehicleDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  summaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  durationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  durationCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  durationLabelSelected: {
    color: colors.primary,
  },
  durationMinutes: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  durationPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});