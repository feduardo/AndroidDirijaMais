// src/presentation/navigation/InstructorStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InstructorDashboardScreen } from '@/presentation/screens';
import { InstructorBookingsScreen } from '@/presentation/screens/instructor/InstructorBookingsScreen';
import { InstructorProfileScreen } from '@/presentation/screens/instructor/InstructorProfileScreen';
import { InstructorBookingDetailScreen } from '../screens/instructor/InstructorBookingDetailScreen';
import { InstructorAgendaScreen } from '../screens/instructor/InstructorAgendaScreen';
import InstructorPixRegistrationScreen from '../screens/instructor/InstructorPixRegistrationScreen';
import InstructorFinancialScreen from '../screens/instructor/InstructorFinancialScreen';
import { InstructorVehiclesScreen } from '../screens/instructor/InstructorVehiclesScreen';
import { InstructorChatScreen } from '../screens/instructor/InstructorChatScreen';
import { InstructorMessagesScreen } from '../screens/instructor/InstructorMessagesScreen';

// ✅ NOVO: telas shared (Indique e Ganhe)
import { ReferralScreen } from '@/presentation/screens/shared/ReferralScreen';
import { ReferralLedgerScreen } from '@/presentation/screens/shared/ReferralLedgerScreen';

export type InstructorStackParamList = {
  Dashboard: undefined;
  InstructorBookings: undefined;
  InstructorBookingDetail: { bookingId: string };
  InstructorAgenda: undefined;
  InstructorProfile: undefined;
  InstructorFinancial: undefined;
  InstructorPixRegistration: undefined;
  InstructorVehicles: undefined;
  InstructorMessages: undefined;
  InstructorChat: { bookingId: string };

  // ✅ NOVO
  ReferralScreen: undefined;
  ReferralLedgerScreen: undefined;
};

const Stack = createStackNavigator<InstructorStackParamList>();

export const InstructorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
    >
      <Stack.Screen name="Dashboard" component={InstructorDashboardScreen} />

      <Stack.Screen
        name="InstructorBookings"
        component={InstructorBookingsScreen}
      />

      <Stack.Screen
        name="InstructorProfile"
        component={InstructorProfileScreen}
      />

      <Stack.Screen
        name="InstructorBookingDetail"
        component={InstructorBookingDetailScreen}
        options={{ title: 'Detalhes da Aula' }}
      />

      <Stack.Screen
        name="InstructorAgenda"
        component={InstructorAgendaScreen}
        options={{ title: 'Minha Agenda' }}
      />

      <Stack.Screen
        name="InstructorFinancial"
        component={InstructorFinancialScreen}
        options={{ title: 'Financeiro', headerShown: true }}
      />

      <Stack.Screen
        name="InstructorPixRegistration"
        component={InstructorPixRegistrationScreen}
        options={{ title: 'Cadastrar Pix', headerShown: true }}
      />

      <Stack.Screen
        name="InstructorVehicles"
        component={InstructorVehiclesScreen}
        options={{ headerShown: true, title: 'Meus Veículos' }}
      />

      <Stack.Screen
        name="InstructorMessages"
        component={InstructorMessagesScreen}
        options={{ title: 'Mensagens' }}
      />

      <Stack.Screen
        name="InstructorChat"
        component={InstructorChatScreen}
        options={{ title: 'Chat' }}
      />

      {/* ✅ NOVO: Indique e Ganhe */}
      <Stack.Screen
        name="ReferralScreen"
        component={ReferralScreen}
        options={{ title: 'Indique e Ganhe', headerShown: true }}
      />
      <Stack.Screen
        name="ReferralLedgerScreen"
        component={ReferralLedgerScreen}
        options={{ title: 'Extrato', headerShown: true }}
      />
    </Stack.Navigator>
  );
};
