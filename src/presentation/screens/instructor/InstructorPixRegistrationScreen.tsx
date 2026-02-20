import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import {
  Button,
  Card,
  HelperText,
  RadioButton,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import WithdrawalMethodRepository from '@/infrastructure/repositories/WithdrawalMethodRepository';
import { colors } from '@/presentation/theme';
import { styles } from './InstructorPixRegistrationScreen.styles';

type PixKeyType = 'cpf' | 'email' | 'phone' | 'random';
type MethodType = 'mercadopago' | 'other_bank';

const PIX_TYPE_CONFIG = {
  cpf: {
    label: 'CPF',
    icon: 'card-account-details',
    description: 'Use seu CPF como chave Pix',
    format: '000.000.000-00',
    keyboardType: 'numeric',
  },
  email: {
    label: 'Email',
    icon: 'email-outline',
    description: 'Seu endereço de email',
    format: 'seu@email.com',
    keyboardType: 'email-address',
  },
  phone: {
    label: 'Telefone',
    icon: 'phone-outline',
    description: 'Número com DDD',
    format: '(00) 00000-0000',
    keyboardType: 'numeric',
  },
  random: {
    label: 'Chave Aleatória',
    icon: 'key-variant',
    description: 'Chave aleatória de 32 caracteres',
    format: 'Cole sua chave',
    keyboardType: 'default',
  },
};

const METHOD_CONFIG = {
  other_bank: {
    label: 'Outro Banco',
    icon: 'bank-outline',
    description: 'Receba via Pix em qualquer banco',
  },
  mercadopago: {
    label: 'Mercado Pago',
    icon: 'wallet-outline',
    description: 'Receba na sua conta Mercado Pago',
  },
};

export default function InstructorPixRegistrationScreen() {
  const navigation = useNavigation();
  const [methodType, setMethodType] = useState<MethodType>('other_bank');
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>('cpf');
  const [pixKey, setPixKey] = useState('');
  const [mpEmail, setMpEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCurrentMethod() {
      try {
        const method = await WithdrawalMethodRepository.getCurrentMethod();
        if (method) {
          setMethodType(method.method_type as MethodType);
          setPixKeyType(method.pix_key_type as PixKeyType);
          setPixKey(method.pix_key);
          if (method.mp_email) {
            setMpEmail(method.mp_email);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar método:', err);
      } finally {
        setLoadingData(false);
      }
    }
    
    loadCurrentMethod();
  }, []);

  const validatePixKey = (): boolean => {
    const trimmedKey = pixKey.trim();

    switch (pixKeyType) {
      case 'cpf':
        const cpfNumbers = trimmedKey.replace(/\D/g, '');
        if (!/^\d{11}$/.test(cpfNumbers)) {
          setError('CPF deve conter 11 dígitos');
          return false;
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedKey)) {
          setError('Email inválido');
          return false;
        }
        break;
      case 'phone':
        const phoneNumbers = trimmedKey.replace(/\D/g, '');
        if (!/^\d{11}$/.test(phoneNumbers)) {
          setError('Telefone deve conter 11 dígitos (DDD + número)');
          return false;
        }
        break;
      case 'random':
        if (trimmedKey.length !== 32) {
          setError('Chave aleatória deve ter 32 caracteres');
          return false;
        }
        break;
    }

    if (methodType === 'mercadopago' && !mpEmail.trim()) {
      setError('Informe o email do Mercado Pago');
      return false;
    }

    return true;
  };

  const formatPixKey = (text: string): string => {
    if (pixKeyType === 'cpf') {
      const numbers = text.replace(/\D/g, '');
      if (numbers.length <= 11) {
        return numbers
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      return numbers.slice(0, 11);
    }
    if (pixKeyType === 'phone') {
      const numbers = text.replace(/\D/g, '');
      if (numbers.length <= 11) {
        return numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
      return numbers.slice(0, 11);
    }
    return text;
  };

  const handleSubmit = async () => {
    setError('');

    if (!validatePixKey()) {
      return;
    }

    try {
      setLoading(true);

      await WithdrawalMethodRepository.createMethod({
        method_type: methodType,
        pix_key_type: pixKeyType,
        pix_key: pixKey.trim(),
        mp_email: methodType === 'mercadopago' ? mpEmail.trim() : undefined,
      });

      Alert.alert(
        '✅ Chave Cadastrada!',
        'Sua chave Pix foi enviada para validação. Aguarde aprovação da equipe (até 24h).',
        [{ 
          text: 'OK', 
          onPress: () => navigation.goBack(),
          style: 'default'
        }]
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          'Não foi possível cadastrar a chave. Verifique os dados e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
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
      <Text variant="headlineSmall" style={styles.title}>
        {pixKey ? 'Editar' : 'Cadastrar'} Chave Pix
      </Text>
    </View>
  );

  const renderMethodOption = (value: MethodType) => {
    const config = METHOD_CONFIG[value];
    const isSelected = methodType === value;

    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.methodOption,
          isSelected && styles.methodOptionSelected
        ]}
        onPress={() => setMethodType(value)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.methodIconContainer,
          isSelected && styles.methodIconSelected
        ]}>
          <MaterialCommunityIcons
            name={config.icon as any}
            size={24}
            color={isSelected ? colors.onPrimary : colors.primary}
          />
        </View>
        <View style={styles.methodContent}>
          <Text variant="titleMedium" style={[
            styles.methodLabel,
            isSelected && styles.methodLabelSelected
          ]}>
            {config.label}
          </Text>
          <Text variant="bodySmall" style={[
            styles.methodDescription,
            isSelected && styles.methodDescriptionSelected
          ]}>
            {config.description}
          </Text>
        </View>
        <RadioButton
          value={value}
          status={isSelected ? 'checked' : 'unchecked'}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const renderPixTypeOption = (value: PixKeyType) => {
    const config = PIX_TYPE_CONFIG[value];
    const isSelected = pixKeyType === value;

    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.pixTypeOption,
          isSelected && styles.pixTypeOptionSelected
        ]}
        onPress={() => {
          setPixKeyType(value);
          setPixKey('');
        }}
        activeOpacity={0.7}
      >
        <View style={[
          styles.pixTypeIcon,
          isSelected && styles.pixTypeIconSelected
        ]}>
          <MaterialCommunityIcons
            name={config.icon as any}
            size={20}
            color={isSelected ? colors.onPrimary : colors.primary}
          />
        </View>
        <View style={styles.pixTypeContent}>
          <Text variant="bodyMedium" style={[
            styles.pixTypeLabel,
            isSelected && styles.pixTypeLabelSelected
          ]}>
            {config.label}
          </Text>
          <Text variant="bodySmall" style={[
            styles.pixTypeDescription,
            isSelected && styles.pixTypeDescriptionSelected
          ]}>
            {config.description}
          </Text>
        </View>
        <RadioButton
          value={value}
          status={isSelected ? 'checked' : 'unchecked'}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text variant="bodyMedium" style={styles.loadingText}>
        Carregando informações...
      </Text>
    </View>
  );

  if (loadingData) {
    return renderLoading();
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.illustration}>
                <MaterialCommunityIcons name="key-variant" size={64} color={colors.primary} />
              </View>
              
              <Text variant="bodyMedium" style={styles.subtitle}>
                Configure como deseja receber seus pagamentos
              </Text>

              {/* Seção: Onde deseja receber */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Onde deseja receber?
                </Text>
                <View style={styles.methodsContainer}>
                  {renderMethodOption('other_bank')}
                  {renderMethodOption('mercadopago')}
                </View>
              </View>

              {/* Seção: Tipo de chave Pix */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Tipo de chave Pix
                </Text>
                <View style={styles.pixTypesContainer}>
                  {(Object.keys(PIX_TYPE_CONFIG) as PixKeyType[]).map(
                    renderPixTypeOption
                  )}
                </View>
              </View>

              {/* Seção: Chave Pix */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Sua chave Pix
                </Text>
                <TextInput
                  mode="outlined"
                  value={pixKey}
                  onChangeText={text => setPixKey(formatPixKey(text))}
                  placeholder={PIX_TYPE_CONFIG[pixKeyType].format}
                  keyboardType={PIX_TYPE_CONFIG[pixKeyType].keyboardType as any}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.pixInput}
                  outlineStyle={styles.pixInputOutline}
                  left={
                    <TextInput.Icon
                      icon={() => (
                        <MaterialCommunityIcons
                          name={PIX_TYPE_CONFIG[pixKeyType].icon as any}
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    />
                  }
                />
                <HelperText type="info" style={styles.pixHelper}>
                  {pixKeyType === 'random' 
                    ? 'Cole sua chave aleatória de 32 caracteres' 
                    : `Digite seu ${PIX_TYPE_CONFIG[pixKeyType].label.toLowerCase()}`
                  }
                </HelperText>
              </View>

              {/* Email Mercado Pago (condicional) */}
              {methodType === 'mercadopago' && (
                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Email do Mercado Pago
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={mpEmail}
                    onChangeText={setMpEmail}
                    placeholder="seu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.emailInput}
                    outlineStyle={styles.emailInputOutline}
                    left={
                      <TextInput.Icon
                        icon="email-outline"
                        color={colors.primary}
                      />
                    }
                  />
                  <HelperText type="info" style={styles.emailHelper}>
                    Email cadastrado na sua conta Mercado Pago
                  </HelperText>
                </View>
              )}

              {/* Mensagem de erro */}
              {!!error && (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={20}
                    color={colors.error}
                  />
                  <Text variant="bodySmall" style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              )}

              {/* Botão de ação */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading || !pixKey.trim()}
                style={styles.submitButton}
                contentStyle={styles.submitButtonContent}
                icon="check-circle-outline"
              >
                {pixKey ? 'Atualizar Chave Pix' : 'Cadastrar Chave Pix'}
              </Button>

              <HelperText type="info" style={styles.disclaimer}>
                Sua chave será validada pela nossa equipe em até 24h.
              </HelperText>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}