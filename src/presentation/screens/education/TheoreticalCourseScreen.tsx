// src/presentation/screens/education/TheoreticalCourseScreen.tsx

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking, Animated, Dimensions } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/presentation/theme';
import { GuestStackParamList } from '@/presentation/navigation';
import Collapsible from 'react-native-collapsible';
import { Platform } from 'react-native';

type TheoreticalCourseScreenNavigationProp = NativeStackNavigationProp<
  GuestStackParamList,
  'TheoreticalCourse'
>;

type Props = { navigation: TheoreticalCourseScreenNavigationProp };

const { width } = Dimensions.get('window');

export const TheoreticalCourseScreen = ({ navigation }: Props) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const scrollY = new Animated.Value(0);

  const handleOpenApp = () => {
    Linking.openURL('https://portalservicos.senatran.serpro.gov.br/#/home');
  };

    const handleOpenStore = () => {
    const appUrl = Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=br.gov.serpro.cnhe'
        : 'https://apps.apple.com/br/app/cnh-do-brasil/id1275057217';
    
    Linking.openURL(appUrl);
    };

  const benefits = [
    {
      icon: 'currency-usd-off',
      title: '100% Gratuito',
      description: 'Curso teórico oficial sem nenhum custo',
      color: colors.success,
    },
    {
      icon: 'clock-outline',
      title: 'No Seu Ritmo',
      description: 'Estude quando e onde quiser',
      color: colors.primary,
    },
    {
      icon: 'school-outline',
      title: 'Conteúdo Oficial',
      description: 'Material do Ministério dos Transportes',
      color: colors.info,
    },
    {
      icon: 'chart-box-outline',
      title: 'Simulados Ilimitados',
      description: 'Pratique antes da prova oficial',
      color: colors.warning,
    },
  ];

  const steps = [
    {
        emoji: '📱',
        title: 'Baixe o App CNH do Brasil',
        description: 'Disponível gratuitamente na Play Store e App Store',
        details: 'Procure por "CNH do Brasil" nas lojas oficiais. O app é desenvolvido pelo SERPRO para o governo federal.',
        action: 'Baixar App',
        actionIcon: 'download',
        onPress: handleOpenStore,
    },
    {
        emoji: '🔐',
        title: 'Faça Login com Gov.br',
        description: 'Use sua conta gov.br para acessar',
        details: 'Se não tiver conta gov.br, crie uma no site oficial. É necessário ter CPF e documento de identidade.',
        action: 'Criar Conta Gov.br',
        actionIcon: 'account-key',
        onPress: () => Linking.openURL('https://www.gov.br/governodigital/pt-br/conta-gov-br'), // ✅ adicionar
    },
    {
      emoji: '📚',
      title: 'Acesse o Curso Teórico',
      description: 'Entre na área de Educação e comece sua jornada',
      details: 'Na tela inicial do app, toque em "Educação" e depois em "Clique aqui para ser um condutor".',
      action: 'Ver Demonstração',
      actionIcon: 'play-circle',
    },
    {
      emoji: '🎯',
      title: 'Estude e Pratique',
      description: 'Assista as aulas e faça os simulados',
      details: 'O curso tem 45h divididas em módulos. Faça os simulados quantas vezes quiser até se sentir preparado.',
      action: 'Ver Conteúdo',
      actionIcon: 'book-open',
    },
    {
      emoji: '✅',
      title: 'Receba seu Certificado',
      description: 'Ao concluir, você estará pronto para a prova',
      details: 'Após completar todos os módulos e simulados, você recebe o certificado digital para agendar a prova teórica.',
      action: 'Ver Certificado',
      actionIcon: 'certificate',
    },
  ];

  const nextSteps = [
    {
      title: 'Biometria no Detran',
      icon: 'fingerprint',
      time: '30 min',
      cost: 'Gratuito',
    },
    {
      title: 'Exames Médico e Psicológico',
      icon: 'stethoscope',
      time: '2-3 horas',
      cost: 'R$ 100-300 - Conforme UF',
    },
    {
      title: 'Prova Teórica Presencial',
      icon: 'clipboard-text',
      time: '1 hora',
      cost: 'Taxa do Detran',
    },
    {
      title: 'Aulas Práticas',
      icon: 'steering',
      time: 'Flexível',
      cost: 'Variável',
    },
  ];

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Curso Teórico Gratuito
        </Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={(e) => {
        scrollY.setValue(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroEmojiContainer}>
            <Text style={styles.heroEmoji}>🎓</Text>
          </View>
          <Text variant="headlineMedium" style={styles.heroTitle}>
            Curso Teórico Gratuito
          </Text>
          <Text variant="bodyLarge" style={styles.heroSubtitle}>
            Aulas 100% online pelo app oficial. Economize tempo e dinheiro!
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="cash" size={20} color={colors.success} />
              <Text style={styles.statText}>Economia de até 80%</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock" size={20} color={colors.primary} />
              <Text style={styles.statText}>Estude no seu tempo</Text>
            </View>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="titleSmall" style={styles.progressTitle}>
              Pronto para começar?
            </Text>
            <Text variant="bodySmall" style={styles.progressSubtitle}>
              Siga os passos abaixo
            </Text>
          </View>
          <ProgressBar progress={1} color={colors.primary} style={styles.progressBar} />
        </View>

        {/* Passo a Passo Interativo */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Como funciona? 📱
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Siga este passo a passo simples para iniciar seu curso
          </Text>
          
          {steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.stepCard,
                expandedStep === index && styles.stepCardExpanded
              ]}
              onPress={() => setExpandedStep(expandedStep === index ? null : index)}
              activeOpacity={0.7}
            >
              <View style={styles.stepHeader}>
                <View style={styles.stepIndicator}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <View style={styles.stepMain}>
                  <Text variant="titleMedium" style={styles.stepTitle}>
                    {step.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.stepDescription}>
                    {step.description}
                  </Text>
                </View>
                <MaterialCommunityIcons 
                  name={expandedStep === index ? 'chevron-up' : 'chevron-down'} 
                  size={24} 
                  color={colors.textSecondary} 
                />
              </View>
              
              <Collapsible collapsed={expandedStep !== index}>
                <View style={styles.stepDetails}>
                  <Text variant="bodySmall" style={styles.stepDetailsText}>
                    {step.details}
                  </Text>
                  
                {step.action && (
                <TouchableOpacity 
                    style={styles.stepActionButton}
                    onPress={step.onPress}
                >
                    <MaterialCommunityIcons 
                    name={step.actionIcon as any} 
                    size={20} 
                    color={colors.primary} 
                    />
                    <Text style={styles.stepActionText}>{step.action}</Text>
                </TouchableOpacity>
                )}                  
                </View>
              </Collapsible>
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefícios em Cards */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Vantagens do Curso Online 🎯
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.benefitsScroll}
            contentContainerStyle={styles.benefitsScrollContent}
          >
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitCard}>
                <View style={[styles.benefitIconContainer, { backgroundColor: benefit.color + '20' }]}>
                  <MaterialCommunityIcons
                    name={benefit.icon as any}
                    size={28}
                    color={benefit.color}
                  />
                </View>
                <Text variant="titleSmall" style={styles.benefitTitle}>
                  {benefit.title}
                </Text>
                <Text variant="bodySmall" style={styles.benefitDescription}>
                  {benefit.description}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Comparação Antes/Depois */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            O que mudou? 📊
          </Text>
          
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonColumn}>
              <Text style={styles.comparisonTitle}>Antes</Text>
              <View style={styles.comparisonList}>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.error} />
                  <Text style={styles.comparisonText}>Autoescola obrigatória</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.error} />
                  <Text style={styles.comparisonText}>Curso pago (R$ 300-500)</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="close-circle" size={16} color={colors.error} />
                  <Text style={styles.comparisonText}>Prazo de 12 meses</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.comparisonDivider} />
            
            <View style={styles.comparisonColumn}>
              <Text style={[styles.comparisonTitle, { color: colors.success }]}>Agora</Text>
              <View style={styles.comparisonList}>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.comparisonText}>Autoescola opcional</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.comparisonText}>Curso 100% gratuito</Text>
                </View>
                <View style={styles.comparisonItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.comparisonText}>Sem prazo limite</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Próximos Passos */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            E depois do curso? 🗓️
          </Text>
          
          <View style={styles.timelineCard}>
            {nextSteps.map((step, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineIcon}>
                  <MaterialCommunityIcons name={step.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.timelineContent}>
                  <Text variant="titleSmall" style={styles.timelineTitle}>
                    {step.title}
                  </Text>
                  <View style={styles.timelineDetails}>
                    <View style={styles.timelineDetail}>
                      <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textSecondary} />
                      <Text style={styles.timelineDetailText}>{step.time}</Text>
                    </View>
                    <View style={styles.timelineDetail}>
                      <MaterialCommunityIcons name="cash" size={14} color={colors.textSecondary} />
                      <Text style={styles.timelineDetailText}>{step.cost}</Text>
                    </View>
                  </View>
                </View>
                {index < nextSteps.length - 1 && (
                  <View style={styles.timelineConnector} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* CTA Principal */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <View style={styles.ctaIconContainer}>
              <MaterialCommunityIcons name="rocket-launch" size={40} color="#FFF" />
            </View>
            <Text variant="headlineSmall" style={styles.ctaTitle}>
              Pronto para começar?
            </Text>
            <Text variant="bodyMedium" style={styles.ctaDescription}>
              Baixe o app oficial e inicie seu curso teórico gratuitamente
            </Text>          
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    elevation: 4,
    zIndex: 100,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  hero: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
  },
  heroEmojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroTitle: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 1,
  },
  statText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: colors.text,
    fontWeight: '600',
  },
  progressSubtitle: {
    color: colors.textSecondary,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  section: {
    padding: 20,
    marginTop: 8,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: '700',
  },
  sectionDescription: {
    color: colors.textSecondary,
    marginBottom: 20,
  },
  stepCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepCardExpanded: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  stepMain: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text,
    marginBottom: 2,
    fontWeight: '600',
  },
  stepDescription: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  stepDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stepDetailsText: {
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  stepActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  stepActionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  benefitsScroll: {
    marginHorizontal: -20,
  },
  benefitsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  benefitCard: {
    width: 150,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  benefitTitle: {
    color: colors.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  benefitDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  comparisonCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comparisonColumn: {
    flex: 1,
  },
  comparisonTitle: {
    color: colors.error,
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 16,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  comparisonList: {
    gap: 8,
  },
  comparisonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  comparisonText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  timelineCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineTitle: {
    color: colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  timelineDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  timelineDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timelineDetailText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  timelineConnector: {
    position: 'absolute',
    left: 24,
    top: 48,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
  ctaSection: {
    padding: 20,
    marginTop: 8,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },
  ctaIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ctaTitle: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '800',
  },
  ctaDescription: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 22,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF20',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF40',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  ctaFooter: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  faqSection: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  faqTitle: {
    color: colors.text,
    marginBottom: 16,
    fontWeight: '700',
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
});