// presentation/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import { validateEmail } from '@/utils/validators';

type NavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'ForgotPassword'
>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setEmailError('E-mail inválido');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://dirijacerto-api.dirijacerto.com.br/api/v1/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        navigation.navigate('VerifyCode', { email });
      } else {
        setEmailError('Erro ao enviar código');
      }
    } catch (error: any) {
      setEmailError(error.message || 'Erro ao enviar código');
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

      <Image
        source={require('@/assets/images/logodirijamais.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text variant="headlineMedium" style={styles.title}>
        Recuperar Senha
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Informe seu e-mail para receber o código de recuperação
      </Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={(text: string) => {
          setEmail(text);
          setEmailError('');
        }}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon="email-outline" />}
        error={!!emailError}
        style={styles.input}
      />

      {emailError && (
        <Text variant="bodyMedium" style={styles.errorText}>
          {emailError}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleSendCode}
        loading={loading}
        disabled={loading || !email}
        style={styles.sendButton}
      >
        Enviar Código
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate('AccountRecovery')}
        style={styles.noAccessContainer}
      >
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text variant="bodyMedium" style={styles.noAccessText}>
          Não tenho mais acesso ao e-mail cadastrado
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text variant="bodyMedium" style={styles.backToLoginText}>
          Lembrou a senha? <Text style={styles.loginLink}>Fazer login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 32,
    paddingHorizontal: 16,
  },

  input: {
    marginBottom: 8,
  },

  errorText: {
    color: colors.error,
    marginBottom: 16,
  },

  sendButton: {
    marginBottom: 16,
  },

  backToLoginText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },

  loginLink: {
    color: colors.primary,
    fontWeight: '600',
  },

  noAccessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 4,
  },

  noAccessText: {
    color: colors.textSecondary,
    marginLeft: 4,
  },
});