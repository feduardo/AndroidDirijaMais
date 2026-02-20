import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { paperTheme } from '@/presentation/theme/paperTheme';
import { RootNavigator } from '@/presentation/navigation';
import 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import ENV from './core/config/env';
import { configureGoogleSignIn } from './core/config/google';
import { registerLogoutHandler } from '@/infrastructure/auth/authEvents';
import { useAuthStore } from '@/presentation/state/authStore';

export default function App() {
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    registerLogoutHandler(logout);
  }, [logout]);

  return (
    <StripeProvider publishableKey={ENV.STRIPE_PUBLISHABLE_KEY}>
      <PaperProvider theme={paperTheme}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <RootNavigator />
      </PaperProvider>
    </StripeProvider>
  );
}
