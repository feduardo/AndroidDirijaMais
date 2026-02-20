import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository';
import { colors } from '@/presentation/theme';
import { Button, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './PaymentScreen.styles';

type PaymentStatus = 'loading' | 'ready' | 'processing' | 'success' | 'error' | 'pending';

export const PaymentScreen = ({ route, navigation }: any) => {
  const { bookingId } = route.params || {};
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (bookingId) {
      initializePayment();
    } else {
      setError('ID da reserva não fornecido');
      setStatus('error');
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [bookingId]);

  const handleBackPress = () => {
    if (!isNavigatingBack) {
      showCancelConfirmation();
      return true;
    }
    return false;
  };

  const showCancelConfirmation = () => {
    Alert.alert(
      'Cancelar Pagamento',
      'Tem certeza que deseja cancelar o pagamento? Você pode retornar mais tarde.',
      [
        { text: 'Continuar', style: 'cancel' },
        { 
          text: 'Cancelar Pagamento', 
          style: 'destructive',
          onPress: () => {
            setIsNavigatingBack(true);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const initializePayment = async () => {
    try {
      setStatus('loading');
      setError(null);
      
      const paymentRepository = new PaymentRepository();
      const intent = await paymentRepository.createIntent(bookingId);

      if (!intent.checkout_url) {
        throw new Error('URL de pagamento não retornada');
      }

      // Backend retorna amount em centavos
      setPaymentAmount(intent.amount);
      setCheckoutUrl(intent.checkout_url);
      setStatus('ready');
    } catch (err: any) {
      console.error('Erro ao iniciar pagamento:', err);
      setError(err.response?.data?.detail || 'Falha ao iniciar o pagamento. Verifique sua conexão.');
      setStatus('error');
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    console.log('🌐 WebView URL:', url);

    // Detecta URLs de retorno
    if (url.includes('/payment/success')) {
      setStatus('success');
      setIsNavigatingBack(true);
      showPaymentResult(
        'Pagamento Aprovado!',
        'Seu pagamento foi processado com sucesso. Aguarde a confirmação do instrutor.',
        'success'
      );
    } else if (url.includes('/payment/failure')) {
      setStatus('error');
      setIsNavigatingBack(true);
      showPaymentResult(
        'Pagamento Recusado',
        'Não foi possível processar seu pagamento. Verifique seus dados e tente novamente.',
        'failure'
      );
    } else if (url.includes('/payment/pending')) {
      setStatus('pending');
      setIsNavigatingBack(true);
      showPaymentResult(
        'Pagamento Pendente',
        'Seu pagamento está sendo processado. Você receberá uma notificação quando for confirmado.',
        'pending'
      );
    } else if (url.includes('mercadopago.com') && navState.loading) {
      setStatus('processing');
    }
  };

  const showPaymentResult = (
    title: string, 
    message: string, 
    type: 'success' | 'failure' | 'pending'
  ) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            if (type === 'success' || type === 'pending') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'StudentBookings' }],
              });
            } else {
              navigation.goBack();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={showCancelConfirmation}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Pagamento Seguro
        </Text>
        {paymentAmount && (
          <Text variant="bodySmall" style={styles.headerSubtitle}>
            Total: R$ {(paymentAmount / 100).toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {status === 'processing' && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <View style={styles.loadingCard}>
        <ActivityIndicator size={64} color={colors.primary} />
        <Text variant="titleMedium" style={styles.loadingTitle}>
          Preparando seu pagamento
        </Text>
        <Text variant="bodyMedium" style={styles.loadingText}>
          Estamos conectando com o Mercado Pago...
        </Text>
      </View>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <View style={styles.errorCard}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color={colors.error}
        />
        <Text variant="titleMedium" style={styles.errorTitle}>
          Erro no Pagamento
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error || 'Não foi possível carregar a página de pagamento.'}
        </Text>
        
        <View style={styles.buttonGroup}>
          <Button
            mode="outlined"
            onPress={() => {
              setIsNavigatingBack(true);
              navigation.goBack();
            }}
            style={styles.secondaryButton}
            contentStyle={styles.buttonContent}
          >
            Voltar
          </Button>
          <Button
            mode="contained"
            onPress={initializePayment}
            style={styles.primaryButton}
            contentStyle={styles.buttonContent}
          >
            Tentar Novamente
          </Button>
        </View>
        
        <Text variant="bodySmall" style={styles.supportText}>
          Em caso de dúvidas, entre em contato com o suporte.
        </Text>
      </View>
    </View>
  );

  const renderWebView = () => (
    <>
      {renderHeader()}
      <WebView
        ref={webViewRef}
        source={{ uri: checkoutUrl! }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <View style={styles.webViewLoadingContent}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="bodyMedium" style={styles.webViewLoadingText}>
                Conectando ao gateway de pagamento...
              </Text>
            </View>
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsBackForwardNavigationGestures={false}
        style={styles.webView}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setError('Erro ao carregar a página de pagamento');
          setStatus('error');
        }}
      />
    </>
  );

  if (status === 'loading') {
    return <View style={styles.container}>{renderLoading()}</View>;
  }

  if (status === 'error' || !checkoutUrl) {
    return <View style={styles.container}>{renderError()}</View>;
  }

  return (
    <View style={styles.container}>
      {renderWebView()}
    </View>
  );
};