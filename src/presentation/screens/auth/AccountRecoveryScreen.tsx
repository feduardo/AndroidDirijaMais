import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import { validateCPF, validateEmail } from '@/utils/validators';
import { formatCPF, formatPhone, removeMask } from '@/utils/formatters';

type NavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'AccountRecovery'
>;

export const AccountRecoveryScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nome obrigatório';
    }

    if (!validateCPF(removeMask(cpf))) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!validateEmail(oldEmail)) {
      newErrors.oldEmail = 'E-mail inválido';
    }

    const cleanPhone = removeMask(phone);
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      newErrors.phone = 'Telefone inválido';
    }

    if (!reason.trim()) {
      newErrors.reason = 'Motivo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: conectar com API real
      // await authRepository.requestAccountRecovery({
      //   fullName,
      //   cpf: removeMask(cpf),
      //   oldEmail,
      //   phone: removeMask(phone),
      //   reason,
      // });

      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));
      setSuccess(true);
    } catch (error: any) {
      setErrors({ form: error.message || 'Erro ao enviar solicitação' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 8 }]}
          onPress={() => navigation.navigate('Login')}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        <MaterialCommunityIcons
          name="check-circle-outline"
          size={80}
          color={colors.success}
          style={styles.successIcon}
        />

        <Text variant="headlineSmall" style={styles.successTitle}>
          Solicitação Enviada!
        </Text>

        <Text variant="bodyMedium" style={styles.successText}>
          Recebemos sua solicitação de recuperação de conta.
          {'\n\n'}
          Nossa equipe irá analisar e responder em até{' '}
          <Text style={styles.highlight}>24 horas</Text> no telefone informado.
          {'\n\n'}
          Você receberá um SMS/WhatsApp com as próximas instruções.
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLoginButton}
        >
          Voltar ao Login
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
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

      <View style={styles.header}>
        <MaterialCommunityIcons
          name="account-lock-outline"
          size={64}
          color={colors.primary}
          style={styles.headerIcon}
        />

        <Text variant="headlineMedium" style={styles.title}>
          Recuperação de Conta
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Preencha os dados abaixo para solicitar recuperação manual da sua
          conta
        </Text>
      </View>

      {errors.form && (
        <Text variant="bodySmall" style={styles.formError}>
          {errors.form}
        </Text>
      )}

      <TextInput
        label="Nome Completo"
        value={fullName}
        onChangeText={text => {
          setFullName(text);
          setErrors({ ...errors, fullName: '' });
        }}
        mode="outlined"
        autoCapitalize="words"
        left={<TextInput.Icon icon="account-outline" />}
        error={!!errors.fullName}
        style={styles.input}
      />
      {errors.fullName && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.fullName}
        </Text>
      )}

      <TextInput
        label="CPF"
        value={cpf}
        onChangeText={text => {
          setCpf(formatCPF(text));
          setErrors({ ...errors, cpf: '' });
        }}
        mode="outlined"
        keyboardType="number-pad"
        maxLength={14}
        left={<TextInput.Icon icon="card-account-details-outline" />}
        error={!!errors.cpf}
        style={styles.input}
      />
      {errors.cpf && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.cpf}
        </Text>
      )}

      <TextInput
        label="E-mail SEM Acesso"
        value={oldEmail}
        onChangeText={text => {
          setOldEmail(text);
          setErrors({ ...errors, oldEmail: '' });
        }}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon="email-off-outline" />}
        error={!!errors.oldEmail}
        style={styles.input}
      />
      {errors.oldEmail && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.oldEmail}
        </Text>
      )}

      <TextInput
        label="Telefone"
        value={phone}
        onChangeText={text => {
          setPhone(formatPhone(text));
          setErrors({ ...errors, phone: '' });
        }}
        mode="outlined"
        keyboardType="phone-pad"
        maxLength={15}
        left={<TextInput.Icon icon="phone-outline" />}
        error={!!errors.phone}
        style={styles.input}
      />
      {errors.phone && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.phone}
        </Text>
      )}

      <TextInput
        label="Motivo da Solicitação"
        value={reason}
        onChangeText={text => {
          setReason(text);
          setErrors({ ...errors, reason: '' });
        }}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="Ex: Perdi acesso ao e-mail, conta invadida, etc."
        left={<TextInput.Icon icon="text-box-outline" />}
        error={!!errors.reason}
        style={[styles.input, styles.textArea]}
      />
      {errors.reason && (
        <Text variant="bodySmall" style={styles.errorText}>
          {errors.reason}
        </Text>
      )}

      <View style={styles.infoBox}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={colors.primary}
        />
        <Text variant="bodySmall" style={styles.infoText}>
          Nossa equipe irá validar seus dados e entrar em contato via telefone
          em até 24 horas.
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        Enviar Solicitação
      </Button>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text variant="bodySmall" style={styles.backText}>
          Voltar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },

  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  headerIcon: {
    marginBottom: 16,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    lineHeight: 20,
  },

  formError: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: `${colors.error}10`,
    padding: 12,
    borderRadius: 8,
  },

  input: {
    marginBottom: 8,
  },

  textArea: {
    minHeight: 80,
  },

  errorText: {
    color: colors.error,
    marginBottom: 12,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },

  infoText: {
    flex: 1,
    color: colors.text,
    lineHeight: 18,
  },

  submitButton: {
    marginBottom: 16,
  },

  backText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },

  // Success State
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  successIcon: {
    alignSelf: 'center',
    marginBottom: 24,
  },

  successTitle: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
  },

  successText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },

  highlight: {
    color: colors.primary,
    fontWeight: '600',
  },

  backToLoginButton: {
    marginTop: 16,
  },
});
