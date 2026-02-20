// presentation/screens/auth/VerifyCodeScreen.tsx
import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';

type NavigationProp = NativeStackNavigationProp<GuestStackParamList, 'VerifyCode'>;
type RouteParams = RouteProp<GuestStackParamList, 'VerifyCode'>;

export const VerifyCodeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const insets = useSafeAreaInsets();
  const { email } = route.params;

  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = [
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
    useRef<RNTextInput>(null),
  ];

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    // Auto-focus próximo campo
    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 4) {
      setError('Digite o código completo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        'https://dirijacerto-api.dirijacerto.com.br/api/v1/auth/verify-reset-code',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: fullCode }),
        }
      );

      const data = await response.json();

      if (data.valid) {
        navigation.navigate('ResetPassword', { email, code: fullCode });
      } else {
        setError(data.message || 'Código inválido');
      }
    } catch (error: any) {
      setError('Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await fetch(
        'https://dirijacerto-api.dirijacerto.com.br/api/v1/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      setCode(['', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (error: any) {
      setError('Erro ao reenviar código');
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

      <MaterialCommunityIcons
        name="email-open-outline"
        size={80}
        color={colors.primary}
        style={styles.icon}
      />

      <Text variant="headlineMedium" style={styles.title}>
        Verificar Código
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Digite o código de 4 dígitos enviado para{'\n'}
        <Text style={styles.emailHighlight}>{email}</Text>
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <RNTextInput
            key={index}
            ref={inputRefs[index]}
            style={[
              styles.codeInput,
              error && styles.codeInputError,
            ]}
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {error && (
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleVerifyCode}
        loading={loading}
        disabled={loading || code.join('').length !== 4}
        style={styles.verifyButton}
      >
        Verificar Código
      </Button>

      <TouchableOpacity
        onPress={handleResendCode}
        disabled={loading}
        style={styles.resendContainer}
      >
        <Text variant="bodyMedium" style={styles.resendText}>
          Não recebeu o código?{' '}
          <Text style={styles.resendLink}>Reenviar</Text>
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

  icon: {
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
    lineHeight: 22,
  },

  emailHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },

  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
    backgroundColor: colors.surface,
  },

  codeInputError: {
    borderColor: colors.error,
  },

  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },

  verifyButton: {
    marginBottom: 16,
  },

  resendContainer: {
    alignItems: 'center',
  },

  resendText: {
    color: colors.textSecondary,
  },

  resendLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});