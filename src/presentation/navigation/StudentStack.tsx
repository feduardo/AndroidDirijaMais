// src/presentation/navigation/StudentStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '@/presentation/screens/student/DashboardScreen';
import { InstructorsListScreen } from '@/presentation/screens/student/InstructorsListScreen';
import { InstructorDetailScreen } from '@/presentation/screens/instructor/InstructorDetailScreen';
import { StudentBookingsScreen } from '@/presentation/screens/student/StudentBookingsScreen';
import { BookingDetailScreen } from '@/presentation/screens/student/BookingDetailScreen';
import { PaymentScreen } from '@/presentation/screens/student/PaymentScreen';
import { StudentProfileScreen } from '../screens/student/StudentProfileScreen';
import { JourneyScreen } from '@/presentation/screens/student/JourneyScreen';
import BookingConfirmationScreen from '@/presentation/screens/student/BookingConfirmationScreen';
import { StudentSimuladosScreen } from '../screens/student/StudentSimuladosScreen';
import { SimuladoExecutionScreen } from '../screens/guest/SimuladoExecutionScreen';
import { SimuladoResultScreen } from '../screens/guest/SimuladoResultScreen';
import { SimuladoHistoryScreen } from '../screens/student/SimuladoHistoryScreen';
import { SimuladoReviewScreen } from '../screens/student/SimuladoReviewScreen';
import { StudentMessagesScreen } from '../screens/student/StudentMessagesScreen';
import { StudentChatScreen } from '../screens/student/StudentChatScreen';
import { StudentFinancialScreen } from '../screens/student/StudentFinancialScreen';

//referral (telas shared)
import { ReferralScreen } from '@/presentation/screens/shared/ReferralScreen';
import { ReferralLedgerScreen } from '@/presentation/screens/shared/ReferralLedgerScreen';

export type StudentStackParamList = {
  Dashboard: undefined;
  InstructorsList: undefined;
  InstructorDetail: { instructorId: string };
  StudentBookings: undefined;
  RequestLesson: { instructorId: string };
  BookingDetail: { bookingId: string };
  Payment: { bookingId: string };
  Profile: undefined;
  StudentProfile: undefined;
  Journey: undefined;
  StudentSimulados: undefined;
  SimuladoHistory: undefined;
  SimuladoReview: { attemptId: string };
  SimuladoExecution: { simuladoId: string; topic?: string };
  SimuladoResult: { attemptId: string };
  BookingConfirmation: {
    bookingId: string;
    summary?: {
      instructor_name?: string;
      instructor_avatar?: string;
      scheduled_date?: string;
      duration_minutes?: number;
      location?: string;
    };
  };
  StudentMessages: undefined;
  StudentChat: { bookingId: string };
  StudentFinancial: undefined;

  ReferralScreen: undefined;
  ReferralLedgerScreen: undefined;
};

const Stack = createStackNavigator<StudentStackParamList>();

export const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="InstructorsList" component={InstructorsListScreen} />
      <Stack.Screen name="InstructorDetail" component={InstructorDetailScreen} />
      <Stack.Screen name="StudentBookings" component={StudentBookingsScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />

      <Stack.Screen
        name="StudentProfile"
        component={StudentProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
      <Stack.Screen
        name="Journey"
        component={JourneyScreen}
        options={{ title: 'Minha Jornada' }}
      />
      <Stack.Screen
        name="StudentSimulados"
        component={StudentSimuladosScreen}
        options={{ title: 'Simulados' }}
      />
      <Stack.Screen
        name="SimuladoHistory"
        component={SimuladoHistoryScreen}
        options={{ title: 'Histórico de Simulados' }}
      />
      <Stack.Screen
        name="SimuladoReview"
        component={SimuladoReviewScreen}
        options={{ title: 'Revisão do Simulado' }}
      />
      <Stack.Screen name="SimuladoExecution" component={SimuladoExecutionScreen} />
      <Stack.Screen name="SimuladoResult" component={SimuladoResultScreen} />

      <Stack.Screen
        name="StudentMessages"
        component={StudentMessagesScreen}
        options={{ title: 'Mensagens' }}
      />
      <Stack.Screen
        name="StudentChat"
        component={StudentChatScreen}
        options={{ title: 'Chat' }}
      />

      <Stack.Screen
        name="StudentFinancial"
        component={StudentFinancialScreen}
        options={{ title: 'Extrato Financeiro', headerShown: true }}
      />

      {/*Indique e Ganhe */}
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
