import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { formatCPF, formatPhone, removeMask } from '../../../utils/formatters';
import {
  validateEmail,
  validateCPF,
  validatePhone,
  validatePassword,
} from '../../../utils/validators';

import { Linking } from 'react-native';

import { PasswordStrengthIndicator } from '@/presentation/components/PasswordStrengthIndicator';

type NavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'RegisterStudent'
>;

export const RegisterStudentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NOVO
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // NOVO
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCPFChange = (text: string) => {
    setCpf(formatCPF(text));
  };

  const handlePhoneChange = (text: string) => {
    setPhone(formatPhone(text));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Telefone inválido';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(', ');
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'Aceite os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        name,
        email,
        cpf: removeMask(cpf),
        phone: removeMask(phone),
        password,
        confirmPassword,
        acceptedTerms,
        role: 'student',
        device_type: 'android',
      });
      
      // Navegar para tela de verificação
      navigation.navigate('VerifyEmail', { email });
      
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro ao fazer cadastro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Criar Conta
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Preencha os dados para começar
        </Text>

        {errors.general && (
          <Text variant="bodySmall" style={styles.errorText}>
            {errors.general}
          </Text>
        )}

        <TextInput
          label="Nome completo"
          value={name}
          onChangeText={setName}
          mode="outlined"
          autoCapitalize="words"
          left={<TextInput.Icon icon="account-outline" />}
          error={!!errors.name}
          style={styles.input}
        />
        {errors.name && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.name}
          </Text>
        )}

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          left={<TextInput.Icon icon="email-outline" />}
          error={!!errors.email}
          style={styles.input}
        />
        {errors.email && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.email}
          </Text>
        )}

        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={handleCPFChange}
          mode="outlined"
          keyboardType="numeric"
          maxLength={14}
          left={<TextInput.Icon icon="card-account-details-outline" />}
          error={!!errors.cpf}
          style={styles.input}
        />
        {errors.cpf && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.cpf}
          </Text>
        )}

        <TextInput
          label="Telefone"
          value={phone}
          onChangeText={handlePhoneChange}
          mode="outlined"
          keyboardType="phone-pad"
          maxLength={15}
          left={<TextInput.Icon icon="phone-outline" />}
          error={!!errors.phone}
          style={styles.input}
        />
        {errors.phone && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.phone}
          </Text>
        )}

        <TextInput
          label="Senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) {
              const { password, ...rest } = errors;
              setErrors(rest);
            }
          }}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          error={!!errors.password}
          style={styles.input}
        />

        <PasswordStrengthIndicator 
          password={password} 
          visible={password.length > 0}
        />

        {errors.password && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.password}
          </Text>
        )}

                <TextInput
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              const { confirmPassword, ...rest } = errors;
              setErrors(rest);
            }
          }}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          left={<TextInput.Icon icon="lock-check-outline" />}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          error={!!errors.confirmPassword}
          style={styles.input}
        />
        {errors.confirmPassword && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.confirmPassword}
          </Text>
        )}

        <View style={styles.termsContainer}>
          <Checkbox
            status={acceptedTerms ? 'checked' : 'unchecked'}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            color={colors.primary}
          />
          <Text variant="bodySmall" style={styles.termsText}>
            Aceito os{' '}
            <Text
              style={styles.termsLink}
              onPress={() => Linking.openURL('https://dirijacerto.com.br/termos')}
            >
              termos de uso
            </Text>{' '}
            e{' '}
            <Text
              style={styles.termsLink}
              onPress={() => Linking.openURL('https://dirijacerto.com.br/privacidade')}
            >
              política de privacidade
            </Text>
          </Text>
        </View>
        {errors.terms && (
          <Text variant="bodySmall" style={styles.fieldError}>
            {errors.terms}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
        >
          Criar Conta
        </Button>

        <View style={styles.loginContainer}>
          <Text variant="bodySmall" style={styles.loginText}>
            Já tem conta?
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant="bodySmall" style={styles.loginLink}>
              Entrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 4,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
  },

  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    marginBottom: 4,
  },

  fieldError: {
    color: colors.error,
    marginBottom: 8,
    marginLeft: 12,
  },

  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },

  termsText: {
    flex: 1,
    color: colors.textSecondary,
    marginLeft: 8,
  },

  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },

  registerButton: {
    marginBottom: 24,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  loginText: {
    color: colors.textSecondary,
    marginRight: 4,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});
