import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Checkbox, RadioButton, ActivityIndicator, Divider, Chip, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import InstructorRepository from '@/infrastructure/repositories/InstructorRepository';
import httpClient from '@/infrastructure/http/client';
import { useAuth } from '@/presentation/hooks/useAuth';
import { colors } from '@/presentation/theme/colors';
import { styles } from './InstructorProfileScreen.styles';
import { Image } from 'react-native';
import { pickImageFromGallery } from '@/utils/imagePicker';
import ENV from '@/core/config/env';

const CNH_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'AB'] as const;

export const InstructorProfileScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['dados-contato']);

  // Endereço
  const [cep, setCep] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  // Perfil profissional
  const [pricePerHour, setPricePerHour] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Veículo
  const [hasOwnVehicle, setHasOwnVehicle] = useState<boolean | null>(null);
  const [acceptsStudentVehicle, setAcceptsStudentVehicle] = useState<boolean | null>(null);
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');

  // CNH
  const [cnhNumber, setCnhNumber] = useState('');
  const [cnhExpiresAt, setCnhExpiresAt] = useState('');
  const [cnhCategories, setCnhCategories] = useState<string[]>([]);

  const [bio, setBio] = useState('');
  const [profileExists, setProfileExists] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);

  // Estados para CNH (adicionar após avatarUrl)
  const [cnhPhotoUploading, setCnhPhotoUploading] = useState(false);
  const [cnhPhotoUrl, setCnhPhotoUrl] = useState<string | null>(null);
  const [cnhPhotoExists, setCnhPhotoExists] = useState(false);


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await InstructorRepository.getProfile();
      setAvatarUrl(user?.avatar_url || avatarUrl);

      setProfileExists(true);

      if (profile.address) {
        setCep(profile.address.cep);
        setState(profile.address.state);
        setCity(profile.address.city);
        setStreet(profile.address.street);
        setNeighborhood(profile.address.neighborhood);
        setAddressNumber(profile.address.number);
        setAddressComplement(profile.address.complement || '');
      }

      setPricePerHour(String(profile.price_per_hour));
      setExperienceYears(String(profile.experience_years));
      setBio(profile.bio || '');
      setHasOwnVehicle(profile.has_own_vehicle);
      setAcceptsStudentVehicle(profile.accepts_student_vehicle);

      if (profile.vehicle) {
        setVehicleBrand(profile.vehicle.brand);
        setVehicleModel(profile.vehicle.model);
        setVehicleYear(String(profile.vehicle.year));
        setVehiclePlate(profile.vehicle.plate);
      }

      if (profile.cnh) {
        setCnhNumber(profile.cnh.number);
        setCnhExpiresAt(formatDateToBR(profile.cnh.expires_at));
        setCnhCategories(profile.cnh.categories);
        setSelectedCategories(profile.categories);
      }

      // Buscar foto da CNH se existir
      if (profile.cnh) {
        try {
          const cnhPhoto = await InstructorRepository.getCnhPhoto();
          if (cnhPhoto) {
            setCnhPhotoUrl(cnhPhoto);
            setCnhPhotoExists(true);
          }
        } catch (error) {
          console.log('CNH photo not found or error loading');
          setCnhPhotoExists(false);
        }
      }

    } catch (error: any) {
      setProfileExists(false);
      if (error.response?.status !== 404) {
        console.log('Erro ao carregar perfil:', error);
      }
    }
  };

  const handleCepChange = (text: string) => {
    const formattedText = text.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(formattedText);
    
    const cleanCep = text.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      fetchAddressByCep(cleanCep);
    }
  };

  const fetchAddressByCep = async (cleanCep: string) => {
    setLoadingCep(true);
    try {
      const response = await httpClient.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (response.data.erro) {
        Alert.alert('Aviso', 'CEP não encontrado. Preencha manualmente.');
        return;
      }

      setState(response.data.uf || '');
      setCity(response.data.localidade || '');
      setStreet(response.data.logradouro || '');
      setNeighborhood(response.data.bairro || '');
    } catch (error) {
      Alert.alert('Aviso', 'Erro ao buscar CEP. Preencha manualmente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCnhCategory = (category: string) => {
    setCnhCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const validateForm = (): boolean => {
    if (cep.replace(/\D/g, '').length !== 8) {
      Alert.alert('Erro', 'CEP deve ter 8 dígitos');
      return false;
    }

    if (!state || !city || !street || !neighborhood) {
      Alert.alert('Erro', 'Preencha todos os campos de endereço');
      return false;
    }

    if (!addressNumber.trim()) {
      Alert.alert('Erro', 'Número do endereço é obrigatório');
      return false;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Erro', 'Selecione ao menos uma categoria');
      return false;
    }

    const price = parseFloat(pricePerHour);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Erro', 'Preço inválido');
      return false;
    }

    const years = parseInt(experienceYears, 10);
    if (isNaN(years) || years < 0) {
      Alert.alert('Erro', 'Anos de experiência inválido');
      return false;
    }

    if (hasOwnVehicle === null || acceptsStudentVehicle === null) {
      Alert.alert('Erro', 'Informe sobre veículo próprio e aceitar veículo do aluno');
      return false;
    }

    if (hasOwnVehicle) {
      if (!vehicleBrand || !vehicleModel || !vehicleYear || !vehiclePlate) {
        Alert.alert('Erro', 'Preencha todos os dados do veículo');
        return false;
      }
      if (vehiclePlate.replace(/\W/g, '').length !== 7) {
        Alert.alert('Erro', 'Placa inválida (7 caracteres)');
        return false;
      }
    }

    if (cnhNumber.replace(/\D/g, '').length !== 11) {
      Alert.alert('Erro', 'CNH deve ter 11 dígitos');
      return false;
    }

    if (!cnhExpiresAt.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      Alert.alert('Erro', 'Data de validade CNH inválida (DD/MM/AAAA)');
      return false;
    }

    const cnhDate = formatDateToISO(cnhExpiresAt);
    const today = new Date().toISOString().split('T')[0];
    
    if (cnhDate < today) {
      Alert.alert('Erro', 'CNH Vencida, Confira a data');
      return false;
    }

    if (cnhCategories.length === 0) {
      Alert.alert('Erro', 'Selecione ao menos uma categoria da CNH');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload: any = {
        cep: cep.replace(/\D/g, ''),
        address_number: addressNumber.trim(),
        address_complement: addressComplement.trim() || undefined,
        bio: bio?.trim() || undefined,
        categories: selectedCategories,
        price_per_hour: parseFloat(pricePerHour),
        experience_years: parseInt(experienceYears, 10),
        has_own_vehicle: hasOwnVehicle,
        accepts_student_vehicle: acceptsStudentVehicle,
        cnh: {
          number: cnhNumber.replace(/\D/g, ''),
          expires_at: formatDateToISO(cnhExpiresAt),
          categories: cnhCategories,
        },
      };

      if (hasOwnVehicle) {
        payload.vehicle = {
          brand: vehicleBrand.trim(),
          model: vehicleModel.trim(),
          year: parseInt(vehicleYear, 10),
          plate: vehiclePlate.replace(/\W/g, '').toUpperCase(),
        };
      }

      if (profileExists) {
        await InstructorRepository.updateProfile(payload);
      } else {
        await InstructorRepository.createProfile(payload);
      }

      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
      navigation.navigate('Dashboard' as never);
    } catch (error: any) {
      const status = error.response?.status;
      const data = error.response?.data;
      let detail = data?.detail;

      if (Array.isArray(detail)) {
        detail = detail[0]?.msg || detail[0] || 'Erro desconhecido';
      }

      if (status === 409) {
        Alert.alert('Erro', 'Perfil já existe');
      } else {
        Alert.alert('Erro', String(detail) || 'Erro ao salvar perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateToBR = (isoDate: string): string => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateToISO = (brDate: string): string => {
    const cleaned = brDate.replace(/\D/g, '');
    if (cleaned.length !== 8) return '';
    const day = cleaned.substring(0, 2);
    const month = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);
    return `${year}-${month}-${day}`;
  };

  const handleCnhDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;
    
    if (cleaned.length >= 2) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }
    if (cleaned.length >= 4) {
      formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4) + '/' + cleaned.substring(4, 8);
    }
    
    setCnhExpiresAt(formatted);
  };
  
  const handleUploadAvatar = async () => {
    try {
      const image = await pickImageFromGallery();
      if (!image) return;

      setAvatarUploading(true);
      const result = await InstructorRepository.uploadAvatar(image);

      // endpoint autenticado (sempre igual)
      setAvatarUrl(result.avatar_url);

      Alert.alert('Sucesso', 'Foto de perfil atualizada.');
    } catch (e: any) {
      Alert.alert('Erro', String(e) || 'Falha ao enviar foto');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleUploadCnhPhoto = async () => {
    try {
      const image = await pickImageFromGallery();
      if (!image) return;

      setCnhPhotoUploading(true);
      const result = await InstructorRepository.uploadCnhPhoto(image);

      // Recarregar a foto da CNH
      const cnhPhoto = await InstructorRepository.getCnhPhoto();
      if (cnhPhoto) {
        setCnhPhotoUrl(cnhPhoto);
        setCnhPhotoExists(true);
      }

      Alert.alert('Sucesso', 'Foto da CNH enviada com sucesso.');
    } catch (e: any) {
      Alert.alert('Erro', String(e.response?.data?.detail || e.message || 'Falha ao enviar CNH'));
    } finally {
      setCnhPhotoUploading(false);
    }
  };

  const renderSection = (sectionId: string, title: string, icon: string, content: React.ReactNode) => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionIcon}>{icon}</Text>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {title}
            </Text>
          </View>
          <Button
            mode="text"
            compact
            onPress={() => toggleSection(sectionId)}
            icon={expandedSections.includes(sectionId) ? 'chevron-up' : 'chevron-down'}
          >
            {expandedSections.includes(sectionId) ? 'Recolher' : 'Expandir'}
          </Button>
        </View>
        
        {expandedSections.includes(sectionId) && content}
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            {profileExists ? 'Editar Perfil' : 'Criar Perfil'}
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Complete suas informações para começar a receber alunos
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text variant="labelMedium" style={styles.progressText}>
            Seções preenchidas: {expandedSections.length}/5
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(expandedSections.length / 5) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Dados de Contato */}
        {renderSection('dados-contato', 'Dados de Contato', '👤', (
          <>
            {/* Nome Completo - Linha única */}
            <View style={styles.fieldContainer}>
              <Text variant="labelSmall" style={styles.fieldLabel}>
                Nome Completo
              </Text>
              <Text variant="bodyMedium" style={styles.fieldValue}>
                {user?.full_name || 'Não informado'}
              </Text>
            </View>

            {/* E-mail - Linha única */}
            <View style={styles.fieldContainer}>
              <Text variant="labelSmall" style={styles.fieldLabel}>
                E-mail
              </Text>
              <Text variant="bodyMedium" style={styles.fieldValue}>
                {user?.email || 'Não informado'}
              </Text>
            </View>

            {/* Telefone e CPF na mesma linha */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text variant="labelSmall" style={styles.fieldLabel}>
                  Telefone
                </Text>
                <Text variant="bodyMedium" style={styles.fieldValue}>
                  {user?.phone || 'Não informado'}
                </Text>
              </View>
              
              <View style={styles.spacer} />
              
              <View style={styles.halfField}>
                <Text variant="labelSmall" style={styles.fieldLabel}>
                  CPF
                </Text>
                <Text variant="bodyMedium" style={styles.fieldValue}>
                  {user?.cpf || 'Não informado'}
                </Text>
              </View>
            </View>
            
            <Text variant="labelSmall" style={styles.sectionNote}>
              Estes dados são gerenciados pelo administrador do sistema
            </Text>

            <Divider style={styles.divider} />

            <Text variant="labelMedium" style={styles.fieldLabel}>
              Foto de perfil
            </Text>

            {avatarUrl ? (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Image
                    source={{ uri: `${ENV.API_URL}${avatarUrl}` }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" style={{ color: colors.success }}>
                      ✓ Foto enviada
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#666', marginTop: 4 }}>
                      Toque no botão para substituir
                    </Text>
                  </View>
                </View>
                
                <Button
                  mode="outlined"
                  onPress={handleUploadAvatar}
                  loading={avatarUploading}
                  disabled={avatarUploading}
                  icon="camera"
                >
                  Substituir foto de perfil
                </Button>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                <Text variant="bodySmall" style={{ color: '#FF9800' }}>
                  ℹ Nenhuma foto enviada
                </Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>
                  Adicione uma foto para seu perfil ficar mais profissional
                </Text>
                
                <Button
                  mode="contained"
                  onPress={handleUploadAvatar}
                  loading={avatarUploading}
                  disabled={avatarUploading}
                  icon="camera"
                  style={{ marginTop: 8 }}
                >
                  Enviar foto de perfil
                </Button>
              </View>
            )}
          </>
        ))}

        {/* Dados Profissionais */}
        {renderSection('dados-profissionais', 'Dados Profissionais', '💼', (
          <>
            <TextInput
              label="Biografia"
              value={bio}
              onChangeText={setBio}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              placeholder="Descreva sua experiência, metodologia e diferencial..."
            />

            <View style={styles.row}>
              <View style={styles.flexItem}>
                <TextInput
                  label="Preço por hora (R$)"
                  value={pricePerHour}
                  onChangeText={setPricePerHour}
                  mode="outlined"
                  keyboardType="decimal-pad"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Affix text="R$" />}
                />
              </View>
              
              <View style={styles.spacer} />
              
              <View style={styles.flexItem}>
                <TextInput
                  label="Anos de experiência"
                  value={experienceYears}
                  onChangeText={setExperienceYears}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  right={<TextInput.Affix text="anos" />}
                />
              </View>
            </View>

            <Text variant="labelMedium" style={styles.fieldLabel}>
              Categorias que ministra
            </Text>
            <View style={styles.chipsContainer}>
              {CNH_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  mode={selectedCategories.includes(cat) ? 'flat' : 'outlined'}
                  selected={selectedCategories.includes(cat)}
                  onPress={() => toggleCategory(cat)}
                  style={styles.categoryChip}
                  selectedColor={colors.primary}
                >
                  Categoria {cat}
                </Chip>
              ))}
            </View>

            <Text variant="labelMedium" style={styles.fieldLabel}>
              Aceita aulas com veículo do aluno?
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setAcceptsStudentVehicle(value === 'true')}
              value={acceptsStudentVehicle === null ? '' : String(acceptsStudentVehicle)}
            >
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="true" color={colors.primary} />
                  <Text style={styles.radioLabel}>Sim</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="false" color={colors.primary} />
                  <Text style={styles.radioLabel}>Não</Text>
                </View>
              </View>
            </RadioButton.Group>
          </>
        ))}

        {/* Veículo */}
        {renderSection('veiculo', 'Veículo', '🚗', (
          <>
            <Text variant="labelMedium" style={styles.fieldLabel}>
              Possui veículo próprio?
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setHasOwnVehicle(value === 'true')}
              value={hasOwnVehicle === null ? '' : String(hasOwnVehicle)}
            >
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="true" color={colors.primary} />
                  <Text style={styles.radioLabel}>Sim</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton.Android value="false" color={colors.primary} />
                  <Text style={styles.radioLabel}>Não</Text>
                </View>
              </View>
            </RadioButton.Group>

            {hasOwnVehicle && (
              <>
                <Divider style={styles.divider} />
                
                <Text variant="titleSmall" style={styles.subsectionTitle}>
                  Dados do Veículo
                </Text>
                
                <View style={styles.row}>
                  <View style={styles.flexItem}>
                    <TextInput
                      label="Marca"
                      value={vehicleBrand}
                      onChangeText={setVehicleBrand}
                      mode="outlined"
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                    />
                  </View>
                  
                  <View style={styles.spacer} />
                  
                  <View style={styles.flexItem}>
                    <TextInput
                      label="Modelo"
                      value={vehicleModel}
                      onChangeText={setVehicleModel}
                      mode="outlined"
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.flexItem}>
                    <TextInput
                      label="Ano"
                      value={vehicleYear}
                      onChangeText={setVehicleYear}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                    />
                  </View>
                  
                  <View style={styles.spacer} />
                  
                  <View style={styles.flexItem}>
                    <TextInput
                      label="Placa"
                      value={vehiclePlate}
                      onChangeText={setVehiclePlate}
                      mode="outlined"
                      style={styles.input}
                      outlineStyle={styles.inputOutline}
                      placeholder="ABC1D23"
                    />
                  </View>
                </View>
              </>
            )}
          </>
        ))}

        {/* Documentos */}
        {renderSection('documentos', 'Documentos', '📄', (
          <>
            <TextInput
              label="Número da CNH"
              value={cnhNumber}
              onChangeText={setCnhNumber}
              mode="outlined"
              keyboardType="numeric"
              maxLength={11}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              placeholder="12345678901"
            />

            <TextInput
              label="Validade CNH"
              value={cnhExpiresAt}
              onChangeText={handleCnhDateChange}
              mode="outlined"
              keyboardType="numeric"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              style={styles.input}
              outlineStyle={styles.inputOutline}
              right={
                cnhExpiresAt && new Date(formatDateToISO(cnhExpiresAt)) < new Date() 
                  ? <TextInput.Icon icon="alert" color={colors.error} />
                  : undefined
              }
            />

            <Text variant="labelMedium" style={styles.fieldLabel}>
              Categorias da CNH
            </Text>
            <View style={styles.chipsContainer}>
              {CNH_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  mode={cnhCategories.includes(cat) ? 'flat' : 'outlined'}
                  selected={cnhCategories.includes(cat)}
                  onPress={() => toggleCnhCategory(cat)}
                  style={styles.categoryChip}
                  selectedColor={colors.primary}
                >
                  Categoria {cat}
                </Chip>
              ))}
            </View>

            <Divider style={styles.divider} />

            <Text variant="labelMedium" style={styles.fieldLabel}>
              Foto da CNH
            </Text>

            {cnhPhotoExists ? (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Image
                    source={{ uri: cnhPhotoUrl || undefined }}
                    style={{ width: 120, height: 80, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" style={{ color: colors.success }}>
                      ✓ CNH enviada
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#666', marginTop: 4 }}>
                      Toque no botão para substituir
                    </Text>
                  </View>
                </View>
                
                <Button
                  mode="outlined"
                  onPress={handleUploadCnhPhoto}
                  loading={cnhPhotoUploading}
                  disabled={cnhPhotoUploading}
                  icon="camera"
                >
                  Substituir foto da CNH
                </Button>
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                <Text variant="bodySmall" style={{ color: colors.error }}>
                  ⚠ CNH pendente de envio
                </Text>
                <Text variant="bodySmall" style={{ color: '#666' }}>
                  É obrigatório enviar uma foto legível da sua CNH
                </Text>
                
                <Button
                  mode="contained"
                  onPress={handleUploadCnhPhoto}
                  loading={cnhPhotoUploading}
                  disabled={cnhPhotoUploading}
                  icon="camera"
                  style={{ marginTop: 8 }}
                >
                  Enviar foto da CNH
                </Button>
              </View>
            )}
          </>
        ))}

        {/* Endereço de Atendimento */}
        {renderSection('endereco', 'Endereço de Atendimento', '📍', (
          <>
            <View style={styles.cepContainer}>
              <TextInput
                label="CEP"
                value={cep}
                onChangeText={handleCepChange}
                mode="outlined"
                keyboardType="numeric"
                maxLength={9}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                placeholder="00000-000"
                right={
                  loadingCep ? (
                    <TextInput.Icon icon={() => <ActivityIndicator size="small" color={colors.primary} />} />
                  ) : (
                    <TextInput.Icon icon="magnify" />
                  )
                }
              />
              <Text style={styles.cepHelper}>
                Digite o CEP para preencher automaticamente
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.stateInput}>
                <TextInput
                  label="Estado"
                  value={state}
                  onChangeText={setState}
                  mode="outlined"
                  maxLength={2}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  placeholder="UF"
                />
              </View>
              
              <View style={styles.spacer} />
              
              <View style={styles.flexItem}>
                <TextInput
                  label="Cidade"
                  value={city}
                  onChangeText={setCity}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                />
              </View>
            </View>

            <TextInput
              label="Rua"
              value={street}
              onChangeText={setStreet}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
            />

            <View style={styles.row}>
              <View style={styles.flexItem}>
                <TextInput
                  label="Bairro"
                  value={neighborhood}
                  onChangeText={setNeighborhood}
                  mode="outlined"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                />
              </View>
              
              <View style={styles.spacer} />
              
              <View style={styles.flexItem}>
                <TextInput
                  label="Número"
                  value={addressNumber}
                  onChangeText={setAddressNumber}
                  mode="outlined"
                  keyboardType="numeric"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                />
              </View>
            </View>

            <TextInput
              label="Complemento"
              value={addressComplement}
              onChangeText={setAddressComplement}
              mode="outlined"
              style={styles.input}
              outlineStyle={styles.inputOutline}
              placeholder="Apto, Bloco, etc."
            />
          </>
        ))}

        {/* Botão de Ação */}
        <Card style={styles.actionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.actionTitle}>
              {profileExists ? 'Atualizar Perfil' : 'Criar Perfil'}
            </Text>
            <Text variant="bodySmall" style={styles.actionDescription}>
              {profileExists
                ? 'Salve as alterações para manter seu perfil atualizado'
                : 'Complete todas as seções para criar seu perfil de instrutor'}
            </Text>
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              icon="check-circle"
            >
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Card.Content>
        </Card>

        {/* Espaço final */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};