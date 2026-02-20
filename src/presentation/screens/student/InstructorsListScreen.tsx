import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { Text, Searchbar, ActivityIndicator, Chip, Menu, Divider, Button  } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { InstructorListCard } from '@/presentation/components/InstructorListCard';
import { colors } from '@/presentation/theme';
import type { Instructor } from '@/domain/entities/Instructor.entity';
import InstructorRepository from '../../../infrastructure/repositories/InstructorRepository';

type SortOption = 'rating' | 'price_asc' | 'price_desc';

export const InstructorsListScreen = ({ navigation }: any) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [hasAddress, setHasAddress] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await InstructorRepository.listInstructors();
      setInstructors(data);
      setHasAddress(true); // Se chegou aqui, tem endereço
    } catch (error: any) {
      setHasAddress(false); // Erro = sem endereço
      setInstructors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInstructors();
  };

  const filteredInstructors = useMemo(() => {
    let result = [...instructors];

    if (searchQuery) {
      result = result.filter(
        instructor =>
          instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instructor.specialties?.some(s =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (showAvailableOnly) {
      result = result.filter(i => i.available);
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_asc':
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price_desc':
        result.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
    }

    return result;
  }, [instructors, searchQuery, sortBy, showAvailableOnly]);

  const handleInstructorPress = (instructor: Instructor) => {
    navigation.navigate('InstructorDetail', { instructorId: instructor.id });
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'rating': return 'star';
      case 'price_asc': return 'trending-up';
      case 'price_desc': return 'trending-down';
      default: return 'sort';
    }
  };

  const renderTopBar = () => {
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 60],
      outputRange: [1, 0.95],
      extrapolate: 'clamp',
    });

    const headerElevation = scrollY.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[
        styles.topBar,
        {
          opacity: headerOpacity,
          elevation: headerElevation,
          shadowOpacity: headerElevation.interpolate({
            inputRange: [0, 3],
            outputRange: [0, 0.1]
          })
        }
      ]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          Encontre seu instrutor
        </Text>
         <View style={styles.emptyRightButton} />
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Conecte-se com os melhores especialistas
      </Text>

      {/*
      <Searchbar
        placeholder="Buscar por nome ou especialidade..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        iconColor={colors.primary}
        theme={{ roundness: 12 }}
        inputStyle={styles.searchInput}
        elevation={2}
      />
      */}

      <View style={styles.filtersContainer}>
        <View style={styles.filterChips}>
          <Chip
            selected={showAvailableOnly}
            onPress={() => setShowAvailableOnly(!showAvailableOnly)}
            style={[
              styles.chip,
              showAvailableOnly && styles.chipSelected
            ]}
            icon={showAvailableOnly ? "check-circle" : "circle-outline"}
            textStyle={showAvailableOnly ? styles.chipTextSelected : styles.chipText}
          >
            Disponíveis agora
          </Chip>

          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Chip
                onPress={() => setSortMenuVisible(true)}
                style={styles.chip}
                icon={getSortIcon()}
                textStyle={styles.chipText}
              >
                {sortBy === 'rating' && 'Melhor avaliação'}
                {sortBy === 'price_asc' && 'Menor preço'}
                {sortBy === 'price_desc' && 'Maior preço'}
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy('rating');
                setSortMenuVisible(false);
              }}
              title="Melhor avaliação"
              leadingIcon="star"
              style={sortBy === 'rating' && styles.menuItemSelected}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setSortBy('price_asc');
                setSortMenuVisible(false);
              }}
              title="Menor preço"
              leadingIcon="trending-up"
              style={sortBy === 'price_asc' && styles.menuItemSelected}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setSortBy('price_desc');
                setSortMenuVisible(false);
              }}
              title="Maior preço"
              leadingIcon="trending-down"
              style={sortBy === 'price_desc' && styles.menuItemSelected}
            />
          </Menu>
        </View>

        <View style={styles.resultsInfo}>
          <Text variant="labelMedium" style={styles.resultsCount}>
            {filteredInstructors.length} {filteredInstructors.length === 1 ? 'instrutor encontrado' : 'instrutores encontrados'}
          </Text>
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text variant="labelSmall" style={styles.clearFilter}>
                Limpar busca
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => {
    if (!hasAddress) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="map-marker-off"
            size={80}
            color={colors.border}
          />
          <Text variant="titleMedium" style={styles.emptyStateTitle}>
            Cadastre seu endereço
          </Text>
          <Text variant="bodyMedium" style={styles.emptyStateText}>
            Para ver instrutores na sua região, cadastre seu endereço primeiro
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('StudentProfile')} 
            style={{ marginTop: 16 }}
            icon="plus-circle"
          >
            Cadastrar endereço
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name="magnify"
          size={80}
          color={colors.border}
        />
        <Text variant="titleMedium" style={styles.emptyStateTitle}>
          Indique Instrutores na Seção Amigos
        </Text>
        <Text variant="bodyMedium" style={styles.emptyStateText}>
          {searchQuery 
            ? 'Tente buscar por outros termos'
            : 'Não há instrutores disponíveis na sua região'}
        </Text>
        {searchQuery && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>Limpar busca</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        {renderTopBar()}
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando instrutores...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderTopBar()}
      <FlatList
        data={filteredInstructors}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
              <View style={[
      styles.cardContainer,
      index === 0 && styles.firstCard,
      index === filteredInstructors.length - 1 && styles.lastCard
    ]}>
      <InstructorListCard
        instructor={item}
        onPress={() => handleInstructorPress(item)}
      />
    </View>

        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        scrollEventThrottle={16}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
  },
  firstCard: {
    marginTop: 8,
  },
  lastCard: {
    marginBottom: 20,
  },  
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 24,
    minHeight: '100%',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: colors.surface,
  },
  welcomeText: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: 24,
  },
  searchbar: {
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    minHeight: 48,
  },
  filtersContainer: {
    marginTop: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.success,
  },
  chipText: {
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.success,
    fontWeight: '600',
  },
  menuItemSelected: {
    backgroundColor: '#F5F5F5',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  resultsCount: {
    color: colors.textSecondary,
  },
  clearFilter: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  topBarTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
  },
  card: {
    marginHorizontal: 20,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateTitle: {
    color: colors.text,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  clearButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  clearButtonText: {
    color: colors.surface,
    fontWeight: '600',
  },
  emptyRightButton: {
    width: 40,
  },

});