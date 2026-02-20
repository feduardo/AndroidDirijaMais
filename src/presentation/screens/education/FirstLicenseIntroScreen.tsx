import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { colors } from '@/presentation/theme';
import { firstLicenseJourney } from '@/shared/content/firstLicense/journey';
import { firstLicenseFAQ } from '@/shared/content/firstLicense/faq';
import { GuestStackParamList } from '@/presentation/navigation';

type NavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'FirstLicenseIntro'
>;

export const FirstLicenseIntroScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Primeira Habilitação
        </Text>
        <Text style={styles.subtitle}>
          Passo a passo oficial para conquistar sua CNH
        </Text>
      </View>

      {/* Contexto */}
      <Card style={styles.infoCard}>
        <Text variant="bodyMedium">
          Baseado na Resolução CONTRAN nº 1.020/2025. Mais liberdade, menos
          custo e escolha do seu instrutor.
        </Text>
      </Card>

      {/* Jornada */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Sua jornada
        </Text>

        {firstLicenseJourney.map(step => (
          <View key={step.id} style={styles.step}>
            <MaterialCommunityIcons
              name={step.icon}
              size={28}
              color={colors.primary}
            />
            <View style={styles.stepText}>
              <Text variant="titleMedium">{step.title}</Text>
              <Text variant="bodySmall" style={styles.stepDescription}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Dúvidas frequentes
        </Text>

        {firstLicenseFAQ.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text variant="titleSmall">{item.question}</Text>
            <Text variant="bodySmall" style={styles.faqAnswer}>
              {item.answer}
            </Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Text variant="titleMedium" style={styles.ctaText}>
          Pronto para começar?
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('RegisterType')}
          style={styles.ctaButton}
        >
          Criar conta grátis
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Já tenho conta</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <Text style={styles.disclaimer}>
        O DirijaCerto é uma plataforma privada e não substitui o DETRAN ou a
        SENATRAN.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 24,
    marginBottom: 16,
  },

  title: {
    color: colors.text,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 4,
  },

  infoCard: {
    padding: 16,
    marginBottom: 24,
  },

  section: {
    marginBottom: 32,
  },

  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },

  step: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },

  stepText: {
    flex: 1,
  },

  stepDescription: {
    color: colors.textSecondary,
    marginTop: 2,
  },

  faqItem: {
    marginBottom: 16,
  },

  faqAnswer: {
    color: colors.textSecondary,
    marginTop: 4,
  },

  cta: {
    alignItems: 'center',
    marginBottom: 32,
  },

  ctaText: {
    marginBottom: 12,
  },

  ctaButton: {
    width: '100%',
    marginBottom: 12,
  },

  loginLink: {
    color: colors.primary,
  },

  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 24,
  },
});
