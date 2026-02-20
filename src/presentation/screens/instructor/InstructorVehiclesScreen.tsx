import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar 
} from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  IconButton, 
  ActivityIndicator, 
  Portal, 
  Modal, 
  TextInput, 
  SegmentedButtons,
  Chip,
  Menu,
  Surface
} from 'react-native-paper';
import { VehicleRepository } from '../../../infrastructure/repositories/VehicleRepository';
import { Vehicle, VehicleCreateDTO, VehicleUpdateDTO } from '../../../domain/entities/Vehicle.entity';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Defina VEHICLE_DATA fora do componente ou use useMemo
const VEHICLE_DATA = {
  Fiat: ['Mobi', 'Argo', 'Cronos', 'Fastback', 'Pulse'],
  Volkswagen: ['Polo', 'Virtus', 'Nivus', 'T-Cross'],
  Chevrolet: ['Onix', 'Onix Plus', 'Prisma', 'Tracker', 'Spin'],
  Ford: ['EcoSport', 'Territory'],
  Renault: ['Sandero', 'Kwid', 'Logan', 'Stepway', 'Captur'],
  Toyota: ['Etios', 'Yaris', 'Corolla Cross'],
  Hyundai: ['HB20', 'HB20S', 'Creta'],
  Jeep: ['Renegade', 'Compass', 'Commander'],
  Honda: ['HR-V', 'WR-V'],
  Nissan: ['Kicks', 'Versa'],
  'CAOA Chery': ['Tiggo'],
};

const { width } = Dimensions.get('window');

export const InstructorVehiclesScreen = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Menu states
  const [brandMenuVisible, setBrandMenuVisible] = useState(false);
  const [modelMenuVisible, setModelMenuVisible] = useState(false);

  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [transmissionType, setTransmissionType] = useState<'manual' | 'automatic'>('manual');
  const [isPrimary, setIsPrimary] = useState(false);

  const vehicleRepo = new VehicleRepository();

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await vehicleRepo.list();
      setVehicles(data.vehicles);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingVehicle(null);
    setModalVisible(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year.toString());
    setPlate(vehicle.plate);
    setTransmissionType(vehicle.transmission_type);
    setIsPrimary(vehicle.is_primary);
    setEditingVehicle(vehicle);
    setModalVisible(true);
  };

  const resetForm = () => {
    setBrand('');
    setModel('');
    setYear('');
    setPlate('');
    setTransmissionType('manual');
    setIsPrimary(false);
  };

  const handleSubmit = async () => {
    if (!brand || !model || !year || !plate) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      Alert.alert('Atenção', 'Ano inválido');
      return;
    }

    try {
      setSubmitting(true);

      if (editingVehicle) {
        const updateData: VehicleUpdateDTO = {
          brand: brand.trim(),
          model: model.trim(),
          year: yearNum,
          plate: plate.trim().toUpperCase(),
          transmission_type: transmissionType,
          is_primary: isPrimary,
        };
        await vehicleRepo.update(editingVehicle.id, updateData);
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso');
      } else {
        const createData: VehicleCreateDTO = {
          brand: brand.trim(),
          model: model.trim(),
          year: yearNum,
          plate: plate.trim().toUpperCase(),
          transmission_type: transmissionType,
          is_primary: isPrimary,
        };
        await vehicleRepo.create(createData);
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso');
      }

      setModalVisible(false);
      loadVehicles();
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.detail || 'Falha ao salvar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este veículo? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await vehicleRepo.delete(id);
              Alert.alert('Sucesso', 'Veículo excluído com sucesso');
              loadVehicles();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir veículo');
            }
          },
        },
      ]
    );
  };

  const renderTransmissionIcon = (type: 'manual' | 'automatic') => {
    return type === 'manual' ? 'car-shift-pattern' : 'car-automatic';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <Text style={styles.headerTitle}>Meus Veículos</Text>
        <Text style={styles.headerSubtitle}>
          {vehicles.length} veículo{vehicles.length !== 1 ? 's' : ''} cadastrado{vehicles.length !== 1 ? 's' : ''}
        </Text>
      </Surface>

      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <TouchableOpacity 
            style={styles.addButtonContainer}
            onPress={openAddModal}
            activeOpacity={0.7}
          >
            <Surface style={styles.addButton} elevation={1}>
              <Icon name="plus-circle" size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Adicionar Veículo</Text>
            </Surface>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="car-off" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Nenhum veículo cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione seu primeiro veículo para começar
            </Text>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={openAddModal}
              style={styles.emptyButton}
              labelStyle={styles.emptyButtonLabel}
            >
              Adicionar Veículo
            </Button>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => openEditModal(item)}
          >
            <Surface style={styles.card} elevation={2}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{item.brand} {item.model}</Text>
                    <View style={styles.vehicleDetails}>
                      <Chip 
                        mode="outlined" 
                        style={styles.yearChip}
                        textStyle={styles.chipText}
                      >
                        {item.year}
                      </Chip>
                      <Chip 
                        mode="outlined" 
                        style={styles.plateChip}
                        textStyle={styles.chipText}
                      >
                        {item.plate}
                      </Chip>
                    </View>
                  </View>
                  
                  <View style={styles.vehicleIconContainer}>
                    <Icon 
                      name={renderTransmissionIcon(item.transmission_type)} 
                      size={28} 
                      color={colors.primary}
                    />
                    {item.is_primary && (
                      <View style={styles.primaryBadge}>
                        <Icon name="star" size={14} color="#FFD700" />
                        <Text style={styles.primaryText}>Principal</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.cardFooter}>
                  <View style={styles.transmissionInfo}>
                    <Text style={styles.transmissionText}>
                      {item.transmission_type === 'manual' ? 'Manual' : 'Automático'}
                    </Text>
                  </View>
                  <View style={styles.cardActions}>
                    <IconButton
                      icon="pencil-outline"
                      size={20}
                      mode="contained"
                      containerColor={colors.surface}
                      iconColor={colors.primary}
                      onPress={() => openEditModal(item)}
                    />
                    <IconButton
                      icon="delete-outline"
                      size={20}
                      mode="contained"
                      containerColor={colors.surface}
                      iconColor={colors.error}
                      onPress={() => handleDelete(item.id)}
                    />
                  </View>
                </View>
              </View>
            </Surface>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              />
            </View>

            {/* Marca */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Marca *</Text>
              <Menu
                visible={brandMenuVisible}
                onDismiss={() => setBrandMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setBrandMenuVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.selectText, !brand && styles.placeholder]}>
                      {brand || 'Selecione uma marca'}
                    </Text>
                    <Icon name="chevron-down" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                }
              >
                {Object.keys(VEHICLE_DATA).map((b) => (
                  <Menu.Item
                    key={b}
                    onPress={() => {
                      setBrand(b);
                      setModel('');
                      setBrandMenuVisible(false);
                    }}
                    title={b}
                    titleStyle={styles.menuItem}
                  />
                ))}
              </Menu>
            </View>

            {/* Modelo */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Modelo *</Text>
              <Menu
                visible={modelMenuVisible}
                onDismiss={() => setModelMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={[styles.selectInput, !brand && styles.disabledInput]}
                    onPress={() => brand && setModelMenuVisible(true)}
                    activeOpacity={0.7}
                    disabled={!brand}
                  >
                    <Text style={[
                      styles.selectText, 
                      !model && styles.placeholder,
                      !brand && styles.disabledText
                    ]}>
                      {model || (brand ? 'Selecione um modelo' : 'Selecione primeiro a marca')}
                    </Text>
                    {brand && (
                      <Icon name="chevron-down" size={24} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                }
              >
                {brand && VEHICLE_DATA[brand as keyof typeof VEHICLE_DATA]?.map((m) => (
                  <Menu.Item
                    key={m}
                    onPress={() => {
                      setModel(m);
                      setModelMenuVisible(false);
                    }}
                    title={m}
                    titleStyle={styles.menuItem}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Ano *</Text>
                <TextInput
                  value={year}
                  onChangeText={setYear}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={4}
                  style={styles.input}
                  outlineColor={colors.outline}
                  activeOutlineColor={colors.primary}
                  placeholder="Ex: 2023"
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.inputLabel}>Placa *</Text>
                <TextInput
                  value={plate}
                  onChangeText={(text) => setPlate(text.toUpperCase())}
                  mode="outlined"
                  autoCapitalize="characters"
                  maxLength={7}
                  style={styles.input}
                  outlineColor={colors.outline}
                  activeOutlineColor={colors.primary}
                  placeholder="ABC1D23"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de Câmbio *</Text>
              <SegmentedButtons
                value={transmissionType}
                onValueChange={(value) => setTransmissionType(value as 'manual' | 'automatic')}
                buttons={[
                  {
                    value: 'manual',
                    label: 'Manual',
                    icon: 'car-shift-pattern',
                    style: styles.segmentedButton,
                  },
                  {
                    value: 'automatic',
                    label: 'Automático',
                    icon: 'car-automatic',
                    style: styles.segmentedButton,
                  },
                ]}
                style={styles.segmented}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Veículo Principal</Text>
              <SegmentedButtons
                value={isPrimary ? 'yes' : 'no'}
                onValueChange={(value) => setIsPrimary(value === 'yes')}
                buttons={[
                  {
                    value: 'no',
                    label: 'Não',
                    icon: 'star-outline',
                    style: styles.segmentedButton,
                  },
                  {
                    value: 'yes',
                    label: 'Sim',
                    icon: 'star',
                    style: styles.segmentedButton,
                  },
                ]}
                style={styles.segmented}
              />
            </View>

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonLabel}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting || !brand || !model || !year || !plate}
                style={styles.saveButton}
                labelStyle={styles.saveButtonLabel}
              >
                {editingVehicle ? 'Salvar Alterações' : 'Cadastrar Veículo'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  list: {
    padding: 16,
    paddingTop: 20,
  },
  addButtonContainer: {
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 10,
    paddingVertical: 8,
  },
  emptyButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  vehicleDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  yearChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
  },
  plateChip: {
    backgroundColor: '#f3e5f5',
    borderColor: '#e1bee7',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleIconContainer: {
    alignItems: 'center',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  primaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f57c00',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  transmissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transmissionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  disabledText: {
    color: '#9e9e9e',
  },
  menuItem: {
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
  },
  segmented: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentedButton: {
    flex: 1,
    height: 48,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  cancelButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});