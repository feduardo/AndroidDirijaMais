import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '@/presentation/theme';
import { GuestInstructorCard, LocationSelector } from '@/presentation/components';
import { GuestStackParamList } from '@/presentation/navigation';
import { useLocation } from '@/presentation/hooks/useLocation';
import { useNearbyInstructors } from '@/presentation/hooks/useNearbyInstructors';
import { styles } from './HomeScreen.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'Home'
>;
type Props = { navigation: HomeScreenNavigationProp };

export const HomeScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { location, isLoading: locationLoading, loadCachedLocation } = useLocation();
  const { instructors, isLoading: instructorsLoading, loadInstructors } = useNearbyInstructors();

  useEffect(() => {
    loadCachedLocation();
  }, []);

  useEffect(() => {
      // Quando localização mudar, buscar instrutores
      if (location) {
        loadInstructors(location.city, location.state, 5);
      }
    }, [location]);

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const displayLocation = location 
    ? `${location.city} - ${location.state}`
    : 'Definir localização';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={22}
            color={colors.primary}
          />
          <View style={styles.locationContainer}>
            <Text variant="bodySmall" style={styles.locationLabel}>
              Localização atual
            </Text>
            {locationLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text variant="bodyMedium" style={styles.locationText}>
                {displayLocation}
              </Text>
            )}
          </View>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color={colors.textSecondary}
            style={styles.locationChevron}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleLoginPress}
          accessible
          accessibilityLabel="Entrar na sua conta"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="headlineSmall" style={styles.welcome}>
          #DirijaCerto
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Aprenda com os melhores profissionais da sua região
        </Text>

        {/* 
        <Searchbar
          placeholder="Buscar instrutor, aula ou serviço"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={colors.primary}
          inputStyle={styles.searchbarInput}
          elevation={2}
        />
        */}

        <View style={styles.actionsGrid}>
          {[
            {
              icon: 'id-card-outline',
              label: 'Primeira\nHabilitação',
              onPress: () => navigation.navigate('FirstLicenseIntro'),
            },
            {
              icon: 'school-outline',
              label: 'Curso\nTeórico',
              onPress: () => navigation.navigate('TheoreticalCourse'),
            },
            {
              icon: 'steering',
              label: 'Indique &\nGanhe',
              onPress: () => navigation.navigate('ReferralCampaign'),
            },
            {
              icon: 'map-marker-radius-outline',
              label: 'Simulados',
              onPress: () => navigation.navigate('SimuladosList'),
            },
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons
                  name={action.icon as any}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text variant="bodyMedium" style={styles.actionText}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.instructorsSection}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {location 
                ? `Instrutores em ${location.city}`
                : 'Instrutores Disponíveis'
              }
            </Text>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text variant="bodyMedium" style={styles.seeAllText}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          {instructorsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="bodyMedium" style={styles.loadingText}>
                Buscando instrutores...
              </Text>
            </View>
          ) : instructors.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.instructorsList}
            >
              {instructors.map((instructor) => (
              <GuestInstructorCard
                key={instructor.id}
                name={instructor.name}
                city={instructor.city}
                state={instructor.state}
                avatar={instructor.avatar}
                distanceKm={instructor.distanceKm}
                style={styles.instructorCardSpacing}
                onPress={handleLoginPress}
              />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-off"
                size={48}
                color={colors.textSecondary}
              />
              <Text variant="bodyMedium" style={styles.emptyText}>
                {location 
                  ? 'Nenhum instrutor encontrado na sua região'
                  : 'Defina sua localização para ver instrutores próximos'
                }
              </Text>
            </View>
          )}
        </View>

        <View style={styles.tipSection}>
          <View style={styles.tipHeader}>
            <MaterialCommunityIcons
              name="lightbulb-outline"
              size={20}
              color={colors.warning}
            />
            <Text variant="titleMedium" style={styles.tipTitle}>
              Dica do Dia
            </Text>
          </View>
          <Text variant="bodyMedium" style={styles.tipText}>
            Escolha um instrutor com boa avaliação e experiência comprovada 
            para garantir um aprendizado eficiente e seguro.
          </Text>
        </View>
      </ScrollView>

      <LocationSelector
        visible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
      />
  </SafeAreaView>
  );
};