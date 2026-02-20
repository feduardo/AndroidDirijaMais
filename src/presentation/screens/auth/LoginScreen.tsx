import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { styles } from '././LoginScreen.styles';
import { GoogleLoginUseCase } from '@/domain/use-cases/auth/GoogleLoginUseCase';
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthStore } from '@/presentation/state/authStore';


type NavigationProp = NativeStackNavigationProp<GuestStackParamList, 'Login'>;

const GoogleIcon = () => (
  <MaterialCommunityIcons name="google" size={20} color="#DB4437" />
);

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { login, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { authMessage, setAuthMessage } = useAuthStore();

  useEffect(() => {
    if (authMessage) {
      Alert.alert('Sessão expirada', authMessage);
      setAuthMessage(null); // evita repetir
    }
  }, [authMessage]);


  const handleLogin = async () => {
    setLoading(true);
    try {
      await login({ email, password });
      // Navegação automática via RootNavigator
    } catch (err: any) {
      // Detectar erro de email não verificado
      const errorDetail = err?.response?.data?.detail || err?.message || '';
      
      if (errorDetail === 'EMAIL_NOT_VERIFIED') {
        // Redirecionar para tela de verificação
        navigation.navigate('VerifyEmail', { email });
      }
      // Outros erros já estão no useAuth.error
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = async () => {
  setLoading(true);
  try {
    const authRepository = new AuthRepository();
    const googleLoginUseCase = new GoogleLoginUseCase(authRepository);
    
    await googleLoginUseCase.execute();
    // Navegação automática via RootNavigator após sucesso
  } catch (err: any) {
    console.error('Erro no login Google:', err);
    // O erro já é tratado no useAuth se necessário
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={styles.container}>
      {/* Voltar */}
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

      {/* Logo */}
      <Image
        source={require('@/assets/images/logodirijamais.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text variant="headlineMedium" style={styles.title}>
        Entrar
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Acesse sua conta para continuar
      </Text>

      {/* Erro de Login */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color={colors.error}
            style={styles.errorIcon}
          />
          <Text variant="bodySmall" style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {/* Email */}
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon="email-outline" />}
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
      />

      {/* Senha */}
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
      />

      {/* Esqueci senha */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotPassword}
      >
        <Text variant="bodySmall" style={styles.forgotText}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      {/* Botão Entrar */}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading || !email || !password}
        style={[
          styles.loginButton,
          (!email || !password) && styles.loginButtonDisabled
        ]}
        contentStyle={styles.loginButtonContent}
      >
        Entrar
      </Button>

      {/* Divisor */}
      {/* <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text variant="bodySmall" style={styles.dividerText}>
          ou
        </Text>
        <Divider style={styles.divider} />
      </View>*/}

      {/* Google */}
      {/*<Button
        mode="outlined"
        icon={GoogleIcon}
        onPress={handleGoogleLogin}
        style={styles.googleButton}
        contentStyle={styles.googleButtonContent}
      >
        Entrar com Google
      </Button>*/}

      <View style={styles.signupContainer}>
        <Text variant="bodySmall" style={styles.signupText}>
          Não tem conta?
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('RegisterType')}>
          <Text variant="bodySmall" style={styles.signupLink}>
            Criar agora
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};