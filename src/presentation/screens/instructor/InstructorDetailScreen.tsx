import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/presentation/theme';
import { RequestLessonForm, RequestLessonData } from '@/presentation/components';
import InstructorRepository from '../../../infrastructure/repositories/InstructorRepository';
import type { Instructor } from '@/domain/entities/Instructor.entity';
import BookingRepository from '@/infrastructure/repositories/BookingRepository';
import type { StudentStackParamList } from '@/presentation/navigation/StudentStack';


type InstructorDetailParams = {
  InstructorDetail: {
    instructorId: string;
  };
};

type RouteParams = RouteProp<InstructorDetailParams, 'InstructorDetail'>;

export const InstructorDetailScreen = () => {
  const navigation =
  useNavigation<NativeStackNavigationProp<StudentStackParamList>>();
  const route = useRoute<RouteParams>();
  const insets = useSafeAreaInsets();

  const { instructorId } = route.params;
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loadInstructor();
  }, [instructorId]);

  const loadInstructor = async () => {
    try {
      setLoading(true);
      const instructors = await InstructorRepository.listInstructors();
      const found = instructors.find(i => i.id === instructorId);
      setInstructor(found || null);
    } catch (error) {
      console.error('Erro ao carregar instrutor:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do instrutor');
    } finally {
      setLoading(false);
    }
  };

const handleRequestLesson = async (data: RequestLessonData) => {
  if (!instructor) return;

  console.log('📍 LOCATION enviado:', data.location);

  console.log('🔍 DATA RECEBIDO DO FORM:', {
    date: data.date,
    time: data.time,
    duration: data.duration,
  });

  // Monta data/hora no formato correto (ISO 8601)
  const dateString = `${data.date.toISOString().split('T')[0]}T${data.time}:00`;
  const scheduledDate = new Date(dateString);

  console.log('🔍 SCHEDULED DATE (ISO):', scheduledDate.toISOString());

  const payload = {
    instructor_id: instructor.user_id,
    scheduled_date: scheduledDate.toISOString(),
    duration_minutes: data.duration * 60,
    location: data.location, 
  };

  console.log('🔥 PAYLOAD ENVIADO:', JSON.stringify(payload, null, 2));

  try {
    const booking = await BookingRepository.create(payload);

    console.log('✅ BOOKING CRIADO:', booking);

    setShowRequestForm(false);

    // Navega para tela de pagamento
    navigation.navigate('Payment', {
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error('❌ Erro ao criar booking:', error);
    
    // Exibe mensagem de erro amigável
    const errorMessage = error.response?.data?.detail || 'Não foi possível criar o agendamento';
    Alert.alert('Erro', errorMessage);
  }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!instructor) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color={colors.textSecondary} />
        <Text variant="bodyLarge">Instrutor não encontrado</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com Voltar */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Detalhes do Instrutor
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar + Info Principal */}
        <View style={styles.profileSection}>
          <Image source={{ uri: instructor.avatar }} style={styles.avatar} />

          <Text variant="headlineSmall" style={styles.name}>
            {instructor.name}
          </Text>

          <View style={styles.categoryBadge}>
            <MaterialCommunityIcons
              name="car"
              size={16}
              color={colors.primary}
            />
            <Text variant="bodyMedium" style={styles.categoryText}>
              Categoria {instructor.driverLicenseCategory}
            </Text>
          </View>

          {/* Rating e Experiência */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={20} color="#FFC107" />
              <Text variant="bodyMedium" style={styles.statValue}>
                {instructor.rating.toFixed(1)}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                avaliação
              </Text>
            </View>

            <Divider style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={20}
                color={colors.primary}
              />
              <Text variant="bodyMedium" style={styles.statValue}>
                {instructor.experience} anos
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                experiência
              </Text>
            </View>

            <Divider style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="account-check"
                size={20}
                color={colors.secondary}
              />
              <Text variant="bodyMedium" style={styles.statValue}>
                {instructor.totalClasses}+
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                aulas dadas
              </Text>
            </View>
          </View>
        </View>

        {/* Sobre */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sobre
          </Text>
          <Text variant="bodyMedium" style={styles.bio}>
            {instructor.bio}
          </Text>
        </View>

        {/* Especialidades */}
        {instructor.specialties && instructor.specialties.length > 0 && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Especialidades
            </Text>
            <View style={styles.chipsContainer}>
              {instructor.specialties.map((specialty, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {specialty}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Veículo */}
        {instructor.vehicleModel && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Veículo
            </Text>
            <View style={styles.vehicleInfo}>
              <MaterialCommunityIcons
                name="car-side"
                size={24}
                color={colors.primary}
              />
              <View style={styles.vehicleText}>
                <Text variant="bodyLarge" style={styles.vehicleModel}>
                  {instructor.vehicleModel}
                </Text>
                <Text variant="bodySmall" style={styles.vehicleYear}>
                  Ano {instructor.vehicleYear}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Localização */}
        {instructor.location && (
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Localização
            </Text>
            <View style={styles.locationInfo}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={colors.primary}
              />
              <Text variant="bodyMedium" style={styles.locationText}>
                {instructor.location.city}, {instructor.location.state}
              </Text>
            </View>
          </View>
        )}

        {/* Preço */}
        <View style={styles.priceSection}>
          <View style={styles.priceInfo}>
            <Text variant="bodyMedium" style={styles.priceLabel}>
              Valor por hora
            </Text>
            <Text variant="headlineMedium" style={styles.priceValue}>
              R$ {instructor.pricePerHour}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer com CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          mode="contained"
          onPress={() => setShowRequestForm(true)}
          style={styles.ctaButton}
          contentStyle={styles.ctaButtonContent}
        >
          Agendar Aula
        </Button>
      </View>

      <Modal
        visible={showRequestForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRequestForm(false)}
      >
        <RequestLessonForm
          instructor={instructor}
          onSubmit={handleRequestLesson}
          onCancel={() => setShowRequestForm(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    marginBottom: 24,
  },
  categoryText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: colors.text,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginTop: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 12,
  },
  bio: {
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.primary,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleText: {
    flex: 1,
  },
  vehicleModel: {
    color: colors.text,
    fontWeight: '600',
  },
  vehicleYear: {
    color: colors.textSecondary,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationText: {
    color: colors.text,
  },
  priceSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  priceInfo: {
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaButton: {
    borderRadius: 8,
  },
  ctaButtonContent: {
    height: 48,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background,
  },
});