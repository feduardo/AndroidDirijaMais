// src/presentation/screens/guest/ReferralCampaignScreen.tsx


import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '@/presentation/theme';
import { styles } from './ReferralCampaignScreen.styles';

type Props = {
  navigation: any; // Simplificado por enquanto
};

export const ReferralCampaignScreen = ({ navigation }: Props) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.iconBadge}>
            <Icon name="gift" size={48} color="#fff" />
          </View>
          
          <Text style={styles.heroTitle}>
            Indique & Ganhe
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Transforme seus amigos em{' '}
            <Text style={styles.highlight}>aulas grátis!</Text>
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Icon name="ticket-percent" size={32} color={colors.primary} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Para seu amigo</Text>
              <Text style={styles.benefitText}>
                <Text style={styles.benefitHighlight}>10% de desconto</Text>
                {'\n'}na primeira aula (até R$ 6,00)
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Icon name="cash-multiple" size={32} color={colors.success} />
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Para você</Text>
              <Text style={styles.benefitText}>
                Acumule <Text style={styles.benefitHighlight}>créditos</Text>
                {'\n'}a cada amigo que fizer aula
              </Text>
            </View>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.milestonesSection}>
          <Text style={styles.sectionTitle}>
            💰 Quanto você pode ganhar?
          </Text>
          
          <View style={styles.milestonesList}>
            {[
              { count: 10, reward: 'R$ 10,00' },
              { count: 25, reward: 'R$ 30,00' },
              { count: 50, reward: 'R$ 60,00' },
              { count: 100, reward: 'R$ 120,00' },
            ].map((m, i) => (
              <View key={i} style={styles.milestoneItem}>
                <View style={styles.milestoneNumber}>
                  <Text style={styles.milestoneCount}>{m.count}</Text>
                  <Text style={styles.milestoneLabel}>amigos</Text>
                </View>
                <Icon name="arrow-right" size={20} color={colors.textSecondary} />
                <View style={styles.milestoneReward}>
                  <Text style={styles.rewardValue}>{m.reward}</Text>
                  <Text style={styles.rewardLabel}>em créditos</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>
            📋 Como funciona?
          </Text>

          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Faça login e pegue seu código</Text>
                <Text style={styles.stepText}>
                  Você recebe um código único para compartilhar
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Compartilhe com seus amigos</Text>
                <Text style={styles.stepText}>
                  Envie por WhatsApp, Instagram ou onde preferir
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Seu amigo ganha desconto</Text>
                <Text style={styles.stepText}>
                  10% OFF na primeira aula dele
                </Text>
              </View>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Você acumula créditos</Text>
                <Text style={styles.stepText}>
                  Use para pagar suas próximas aulas!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaBox}>
            <Text style={styles.ctaTitle}>
              🚀 Comece agora mesmo!
            </Text>
            <Text style={styles.ctaText}>
              Entre na sua conta e compartilhe seu código com amigos.
              Quanto mais amigos, mais você economiza!
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Entrar e Pegar Meu Código</Text>
            <Icon name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            * Válido apenas para novos alunos na primeira aula
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};