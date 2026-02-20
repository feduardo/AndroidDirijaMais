import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';

type NavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'RegisterType'
>;

export const RegisterTypeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

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
        Como você quer começar?
      </Text>

      <Text variant="bodyMedium" style={styles.subtitle}>
        Escolha o tipo de conta
      </Text>

      <Card
        style={styles.card}
        onPress={() => navigation.navigate('RegisterStudent')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name="school-outline"
            size={48}
            color={colors.primary}
          />
          <View style={styles.cardText}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Sou Aluno
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Quero aprender a dirigir
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </Card.Content>
      </Card>
      <Card
        style={styles.card}
        onPress={() => navigation.navigate('RegisterInstructor')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons
            name="account-tie"
            size={48}
            color={colors.secondary}
          />
          <View style={styles.cardText}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Sou Instrutor
            </Text>
            <Text variant="bodyMedium" style={styles.cardDescription}>
              Quero ensinar a dirigir
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </Card.Content>
      </Card>

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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 28,
    borderRadius: 16,
  },

  title: {
    textAlign: 'center',
    color: colors.text,
    marginBottom: 4,
    fontWeight: '700',
    fontSize: 26,
    letterSpacing: -0.5,
  },

  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 32,
    fontSize: 15,
    lineHeight: 22,
  },

  card: {
    marginBottom: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 2,
    shadowColor: colors.shadow.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  cardText: {
    flex: 1,
    marginLeft: 16,
  },

  cardTitle: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
    fontSize: 17,
  },

  cardDescription: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginText: {
    color: colors.textSecondary,
    marginRight: 4,
    fontSize: 15,
  },

  loginLink: {
    color: colors.primaryMid,
    fontWeight: '700',
    fontSize: 15,
  },
});
