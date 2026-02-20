// presentation/components/PasswordStrengthIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';

interface PasswordRule {
  label: string;
  isValid: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  visible?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  visible = true,
}) => {
  if (!visible) return null;

  const rules: PasswordRule[] = [
    {
      label: 'Mínimo de 8 caracteres',
      isValid: password.length >= 8,
    },
    {
      label: 'Uma letra maiúscula',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'Uma letra minúscula',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'Um número',
      isValid: /\d/.test(password),
    },
  ];

  return (
    <View style={styles.container}>
      {rules.map((rule, index) => (
        <View key={index} style={styles.ruleContainer}>
          <MaterialCommunityIcons
            name={rule.isValid ? 'check-circle' : 'close-circle'}
            size={16}
            color={rule.isValid ? colors.success : colors.error}
          />
          <Text
            variant="bodySmall"
            style={[
              styles.ruleText,
              { color: rule.isValid ? colors.success : colors.error },
            ]}
          >
            {rule.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  ruleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  ruleText: {
    flex: 1,
  },
});