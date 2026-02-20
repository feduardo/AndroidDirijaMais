// presentation/screens/auth/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import { PasswordStrengthIndicator } from '@/presentation/components/PasswordStrengthIndicator';

type NavigationProp = NativeStackNavigationProp<GuestStackParamList, 'ResetPassword'>;
type RouteParams = RouteProp<GuestStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const insets = useSafeAreaInsets();
  const { email, code } = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 8) {
      setError('Senha deve ter no mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://dirijacerto-api.dirijacerto.com.br/api/v1/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            code,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Navegar para tela de sucesso ou login
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',
              params: { 
                successMessage: 'Senha alterada com sucesso! Faça login com sua nova senha.'
              } as any,
            },
          ],
        });
      } else {
        setError(data.detail || 'Erro ao redefinir senha');
      }
    } catch (error: any) {
      setError('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
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
        name="lock-reset"
        size={80}
        color={colors.primary}
        style={styles.icon}
      />

      <Text variant="headlineMedium" style={styles.title}>
        Nova Senha
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Digite sua nova senha abaixo
      </Text>

      <TextInput
        label="Nova Senha"
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          setError('');
        }}
        mode="outlined"
        secureTextEntry={!showNewPassword}
        autoCapitalize="none"
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showNewPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowNewPassword(!showNewPassword)}
          />
        }
        error={!!error}
        style={styles.input}
      />

      <PasswordStrengthIndicator 
        password={newPassword} 
        visible={newPassword.length > 0}
      />

      <TextInput
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError('');
        }}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        autoCapitalize="none"
        left={<TextInput.Icon icon="lock-check-outline" />}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
        error={!!error}
        style={styles.input}
      />

      {error && (
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={loading}
        disabled={loading || !newPassword || !confirmPassword}
        style={styles.resetButton}
      >
        Redefinir Senha
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  },

  input: {
    marginBottom: 8,
  },

  errorText: {
    color: colors.error,
    marginBottom: 16,
  },

  resetButton: {
    marginTop: 16,
  },
});