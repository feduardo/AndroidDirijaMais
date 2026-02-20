import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  TextInput as RNTextInput
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/presentation/theme';
import httpClient from '@/infrastructure/http/client';
import SecureStorage from '@/infrastructure/storage/SecureStorage';
import { GuestStackParamList } from '@/presentation/navigation';
import { styles } from '././VerifyEmailScreen.styles';
import { useAuthStore } from '@/presentation/state/authStore';

type NavigationProp = NativeStackNavigationProp<GuestStackParamList>;

type RouteParams = {
  email: string;
};

export const VerifyEmailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVerify = async () => {
    if (code.length !== 4) {
      setError('Informe o código de 4 dígitos');
      triggerShake();
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const res = await httpClient.post('/api/v1/auth/verify-email-code', {
        email,
        code,
        device_type: Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web',
      });

      // Salvar tokens
      await SecureStorage.setItem('@app:token', res.data.access_token);
      await SecureStorage.setItem('@app:refresh_token', res.data.refresh_token);

      // Atualizar store (dispara navegação automática)
      await useAuthStore.getState().login(
        res.data.user,
        res.data.access_token,
        res.data.refresh_token
      );
      
    } catch (e: any) {
      console.log('ERRO COMPLETO:', JSON.stringify(e.response?.data, null, 2));
      
      const errorMessage = e?.response?.data?.detail || 'Código inválido. Tente novamente.';
      setError(errorMessage);
      triggerShake();
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setResending(true);
    setError(null);
    setInfo(null);
    setCanResend(false);
    setCountdown(30);
    
    try {
      await httpClient.post('/api/v1/auth/resend-verification-code', { email });
      setInfo('Novo código enviado para seu email');
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erro ao reenviar código. Tente novamente.');
      setCanResend(true);
      setCountdown(0);
    } finally {
      setResending(false);
    }
  };

  const handleChangeCode = (text: string) => {
    const numericText = text.replace(/\D/g, '');
    setCode(numericText.slice(0, 4));
    
    if (numericText.length < 4) {
      inputRefs.current[numericText.length]?.focus();
    } else if (numericText.length === 4) {
      inputRefs.current[3]?.blur();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && code.length > 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const renderCodeInputs = () => {
    return (
      <Animated.View 
        style={[
          styles.codeContainer,
          { transform: [{ translateX: shakeAnimation }] }
        ]}
      >
        {[0, 1, 2, 3].map((index) => {
          const digit = code[index] || '';
          
          return (
            <View key={index} style={styles.digitContainer}>
              <TextInput
                ref={(ref: any) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => {
                  if (text.length > 1) return;
                  const newCode = code.split('');
                  newCode[index] = text;
                  handleChangeCode(newCode.join(''));
                }}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                style={styles.digitInput}
                theme={{ 
                  colors: { 
                    primary: colors.primary,
                    background: colors.surface 
                  } 
                }}
                mode="outlined"
                outlineColor={digit ? colors.primary : colors.border}
                textAlign="center"
                caretHidden={true}
                selectTextOnFocus
              />
              <View style={[styles.digitLabel, digit && styles.digitLabelFilled]}>
                <Text style={styles.digitLabelText}>{index + 1}</Text>
              </View>
            </View>
          );
        })}
      </Animated.View>
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>✉</Text>
            </View>
          </View>
          
          <Text variant="headlineMedium" style={styles.title}>
            Verifique seu email
          </Text>

          <Text variant="bodyMedium" style={styles.subtitle}>
            Enviamos um código de 4 dígitos para:
          </Text>
          
          <Text variant="bodyMedium" style={styles.emailText}>
            {email}
          </Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>!</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
          
          {info && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoIcon}>✓</Text>
              <Text style={styles.info}>{info}</Text>
            </View>
          )}

          {renderCodeInputs()}
          
          <Text style={styles.codeHint}>
            Digite o código recebido no seu email
          </Text>

          <Button
            mode="contained"
            onPress={handleVerify}
            loading={loading}
            disabled={loading || code.length !== 4}
            style={[
              styles.primaryBtn,
              (loading || code.length !== 4) && styles.primaryBtnDisabled
            ]}
            contentStyle={styles.primaryBtnContent}
          >
            {loading ? 'Validando...' : 'Validar código'}
          </Button>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Não recebeu o código?{' '}
            </Text>
            <TouchableOpacity 
              onPress={handleResend} 
              disabled={resending || !canResend || countdown > 0}
            >
              <Text style={[
                styles.link,
                (resending || !canResend || countdown > 0) && styles.linkDisabled
              ]}>
                {resending 
                  ? 'Enviando...' 
                  : countdown > 0 
                    ? `Reenviar (${countdown}s)` 
                    : 'Reenviar código'
                }
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};