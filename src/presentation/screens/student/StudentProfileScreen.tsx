import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import httpClient from '@/infrastructure/http/client';
import { colors } from '@/presentation/theme';

export const StudentProfileScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Endereço
  const [cep, setCep] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [primaryAddressId, setPrimaryAddressId] = useState<string | null>(null);


  // Perfil
  const [desiredCategory, setDesiredCategory] = useState<'A' | 'B' | 'AB' | 'ACC'>('B');
  const [hasCnh, setHasCnh] = useState(false);
  const [cnhNumber, setCnhNumber] = useState('');
  const [cnhCategory, setCnhCategory] = useState<'A' | 'B' | 'AB' | 'ACC'>('B');
  const [hasVehicle, setHasVehicle] = useState(false);
  const [preferredShift, setPreferredShift] =
    useState<'morning' | 'afternoon' | 'night' | 'flexible'>('flexible');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profileResponse, addressResponse] = await Promise.all([
        httpClient.get('/api/v1/students/profile'),
        httpClient.get('/api/v1/students/addresses'),
      ]);

      setProfileExists(true);

      const profile = profileResponse.data;
      setDesiredCategory(profile.desired_category);
      setHasCnh(profile.has_cnh);
      setCnhNumber(profile.cnh_number || '');
      setCnhCategory(profile.cnh_category || 'B');
      setHasVehicle(profile.has_own_vehicle);
      setPreferredShift(profile.preferred_shift || 'flexible');

      const primaryAddress = addressResponse.data.find((addr: any) => addr.is_primary);
      if (primaryAddress) {
        setPrimaryAddressId(primaryAddress.id);
        setCep(primaryAddress.cep);
        setState(primaryAddress.state);
        setCity(primaryAddress.city);
        setStreet(primaryAddress.street);
        setNeighborhood(primaryAddress.neighborhood);
        setAddressNumber(primaryAddress.number);
        setAddressComplement(primaryAddress.complement || '');
      }


    } catch (error: any) {
      if (error.response?.status === 404) {
        setProfileExists(false);
      } else {
        console.log('Erro ao carregar perfil:', error);
      }
    }
  };

  const handleCepChange = (text: string) => {
    setCep(text);
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
    } catch {
      Alert.alert('Aviso', 'Erro ao buscar CEP. Preencha manualmente.');
    } finally {
      setLoadingCep(false);
    }
  };

  const validateForm = (): boolean => {
    if (cep.replace(/\D/g, '').length !== 8) {
      Alert.alert('Erro', 'CEP deve ter 8 dígitos');
      return false;
    }
    if (!state || !city || !street || !neighborhood || !addressNumber.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos de endereço');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const profilePayload: any = {
        desired_category: desiredCategory,
        has_cnh: hasCnh,
        has_own_vehicle: hasVehicle,
        preferred_shift: preferredShift,
        has_driving_experience: false,
        goal: 'first_license',
      };

      if (hasCnh) {
        profilePayload.cnh_number = cnhNumber;
        profilePayload.cnh_category = cnhCategory;
      }

      if (profileExists) {
        await httpClient.put('/api/v1/students/profile', profilePayload);
      } else {
        await httpClient.post('/api/v1/students/profile', profilePayload);
      }

      const addressPayload = {
        cep: cep.replace(/\D/g, ''),
        state,
        city,
        street,
        neighborhood,
        number: addressNumber.trim(),
        complement: addressComplement.trim() || undefined,
        is_primary: true,
      };

      if (primaryAddressId) {
        await httpClient.put(
          `/api/v1/students/addresses/${primaryAddressId}`,
          addressPayload
        );
      } else {
        await httpClient.post('/api/v1/students/addresses', addressPayload);
      }

      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      Alert.alert('Erro', String(detail) || 'Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAddress = async () => {
    if (!primaryAddressId) return;

    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente remover este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await httpClient.delete(
                `/api/v1/students/addresses/${primaryAddressId}`
              );

              // limpar estados de endereço
              setPrimaryAddressId(null);
              setCep('');
              setState('');
              setCity('');
              setStreet('');
              setNeighborhood('');
              setAddressNumber('');
              setAddressComplement('');

              Alert.alert('Sucesso', 'Endereço removido com sucesso');
            } catch (error: any) {
              const detail = error.response?.data?.detail;
              Alert.alert('Erro', String(detail) || 'Erro ao remover endereço');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {profileExists ? 'Meu Perfil' : 'Complete seu Perfil'}
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Endereço
        </Text>

        <View style={styles.cepContainer}>
          <TextInput
            label="CEP *"
            value={cep}
            onChangeText={handleCepChange}
            mode="outlined"
            keyboardType="numeric"
            maxLength={9}
            style={styles.input}
            right={
              loadingCep ? (
                <TextInput.Icon icon={() => <ActivityIndicator size="small" />} />
              ) : undefined
            }
          />
        </View>

        <TextInput label="Estado (UF) *" value={state} onChangeText={setState} mode="outlined" maxLength={2} style={styles.input} />
        <TextInput label="Cidade *" value={city} onChangeText={setCity} mode="outlined" style={styles.input} />
        <TextInput label="Rua *" value={street} onChangeText={setStreet} mode="outlined" style={styles.input} />
        <TextInput label="Bairro *" value={neighborhood} onChangeText={setNeighborhood} mode="outlined" style={styles.input} />
        <TextInput label="Número *" value={addressNumber} onChangeText={setAddressNumber} mode="outlined" keyboardType="numeric" style={styles.input} />
        <TextInput label="Complemento" value={addressComplement} onChangeText={setAddressComplement} mode="outlined" style={styles.input} />

        <Text variant="titleMedium" style={styles.sectionTitle}>Categoria Desejada</Text>
        <SegmentedButtons
          value={desiredCategory}
          onValueChange={(value) => setDesiredCategory(value as any)}
          buttons={[
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'AB', label: 'AB' },
            { value: 'ACC', label: 'ACC' },
          ]}
          style={styles.segmented}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Já possui CNH?</Text>
        <SegmentedButtons
          value={hasCnh ? 'yes' : 'no'}
          onValueChange={(value) => setHasCnh(value === 'yes')}
          buttons={[
            { value: 'no', label: 'Não' },
            { value: 'yes', label: 'Sim' },
          ]}
          style={styles.segmented}
        />

        {hasCnh && (
          <>
            <TextInput label="Número da CNH" value={cnhNumber} onChangeText={setCnhNumber} mode="outlined" keyboardType="numeric" style={styles.input} />
            <Text variant="titleSmall" style={styles.label}>Categoria Atual</Text>
            <SegmentedButtons
              value={cnhCategory}
              onValueChange={(value) => setCnhCategory(value as any)}
              buttons={[
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'AB', label: 'AB' },
                { value: 'ACC', label: 'ACC' },
              ]}
              style={styles.segmented}
            />
          </>
        )}

        <Text variant="titleMedium" style={styles.sectionTitle}>Possui veículo próprio?</Text>
        <SegmentedButtons
          value={hasVehicle ? 'yes' : 'no'}
          onValueChange={(value) => setHasVehicle(value === 'yes')}
          buttons={[
            { value: 'no', label: 'Não' },
            { value: 'yes', label: 'Sim' },
          ]}
          style={styles.segmented}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Turno Preferido</Text>
        <SegmentedButtons
          value={preferredShift}
          onValueChange={(value) => setPreferredShift(value as any)}
          buttons={[
            { value: 'morning', label: 'Manhã' },
            { value: 'afternoon', label: 'Tarde' },
            { value: 'night', label: 'Noite' },
            { value: 'flexible', label: 'Flexível' },
          ]}
          style={styles.segmented}
        />

        <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
          {profileExists ? 'Atualizar Perfil' : 'Criar Perfil'}
        </Button>
        {primaryAddressId && (
        <Button
          mode="outlined"
          onPress={handleDeleteAddress}
          style={{ marginTop: 8 }}
          textColor="red"
        >
          Remover Endereço
        </Button>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { marginBottom: 24 },
  sectionTitle: { marginTop: 24, marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 8, color: '#666' },
  cepContainer: { position: 'relative' },
  input: { marginBottom: 16 },
  segmented: { marginBottom: 16 },
  button: { marginTop: 24, marginBottom: 40 },
});
