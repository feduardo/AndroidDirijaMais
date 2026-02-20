// src/presentation/components/LocationSelector.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/presentation/theme';
import { IBGEService } from '@/infrastructure/services/IBGEService';
import { useLocation } from '@/presentation/hooks/useLocation';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

const ibgeService = new IBGEService();

export const LocationSelector = ({ visible, onDismiss }: Props) => {
  const { updateLocation } = useLocation();
  const [states, setStates] = useState<Array<{ value: string; label: string }>>([]);
  const [cities, setCities] = useState<Array<{ value: string; label: string }>>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadStates();
    }
  }, [visible]);

  const loadStates = async () => {
    const data = await ibgeService.getStates();
    setStates(data);
  };

  const handleStateChange = async (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedCity('');
    setCities([]);

    if (stateCode) {
      const data = await ibgeService.getCitiesByState(stateCode);
      setCities(data);
    }
  };

  const handleConfirm = async () => {
    if (!selectedState || !selectedCity) return;

    setLoading(true);
    try {
      await updateLocation({
        city: selectedCity,
        state: selectedState,
        country: 'BR',
        source: 'manual',
      });
      onDismiss();
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        <Text variant="titleLarge" style={styles.title}>
          Selecione sua localização
        </Text>

        <View style={styles.pickerContainer}>
          <Text variant="bodyMedium" style={styles.label}>
            Estado
          </Text>
          <Picker
            selectedValue={selectedState}
            onValueChange={handleStateChange}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o estado" value="" />
            {states.map(state => (
              <Picker.Item key={state.value} label={state.label} value={state.value} />
            ))}
          </Picker>
        </View>

        {selectedState && (
          <View style={styles.pickerContainer}>
            <Text variant="bodyMedium" style={styles.label}>
              Cidade
            </Text>
            <Picker
              selectedValue={selectedCity}
              onValueChange={setSelectedCity}
              style={styles.picker}
              enabled={cities.length > 0}
            >
              <Picker.Item label="Selecione a cidade" value="" />
              {cities.map(city => (
                <Picker.Item key={city.value} label={city.label} value={city.value} />
              ))}
            </Picker>
          </View>
        )}

        <View style={styles.actions}>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirm}
            disabled={!selectedState || !selectedCity || loading}
            loading={loading}
            style={styles.button}
          >
            Confirmar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: colors.text,
  },
  picker: {
    backgroundColor: '#f5f5f5',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});