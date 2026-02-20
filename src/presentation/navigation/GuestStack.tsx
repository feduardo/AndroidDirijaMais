// presentation/navigation/GuestStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  LoginScreen,
  ForgotPasswordScreen,
  AccountRecoveryScreen,
  RegisterTypeScreen,
  RegisterStudentScreen,
  RegisterInstructorScreen,
  FirstLicenseIntroScreen,
} from '@/presentation/screens';
import { InstructorDetailScreen } from '@/presentation/screens/instructor/InstructorDetailScreen';
import { VerifyEmailScreen } from '@/presentation/screens/auth/VerifyEmailScreen';
import { TheoreticalCourseScreen } from '../screens/education/TheoreticalCourseScreen';
import { VerifyCodeScreen } from '@/presentation/screens/auth/VerifyCodeScreen';
import { ResetPasswordScreen } from '@/presentation/screens/auth/ResetPasswordScreen';
import { SimuladosListScreen } from '../screens/guest/SimuladosListScreen';
import { SimuladoExecutionScreen } from '../screens/guest/SimuladoExecutionScreen';
import { SimuladoResultScreen } from '../screens/guest/SimuladoResultScreen';
import { ReferralCampaignScreen } from '@/presentation/screens/guest/ReferralCampaignScreen';

export type GuestStackParamList = {
  Home: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  AccountRecovery: undefined;
  RegisterType: undefined;
  RegisterStudent: undefined;
  RegisterInstructor: undefined;
  FirstLicenseIntro: undefined;
  InstructorDetail: { instructorId: string };
  VerifyEmail: { email: string };
  TheoreticalCourse: undefined;
  VerifyCode: { email: string };
  ResetPassword: { email: string; code: string };
  SimuladosList: undefined;
  SimuladoExecution: { simuladoId: string; topic?: string };
  SimuladoResult: { attemptId: string };
  ReferralCampaign: undefined;
};

const Stack = createStackNavigator<GuestStackParamList>();

export const GuestStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="RegisterType" component={RegisterTypeScreen} />
      <Stack.Screen name="AccountRecovery" component={AccountRecoveryScreen} />
      <Stack.Screen name="RegisterStudent" component={RegisterStudentScreen} />
      <Stack.Screen name="RegisterInstructor" component={RegisterInstructorScreen} />
      <Stack.Screen name="FirstLicenseIntro" component={FirstLicenseIntroScreen} />
      <Stack.Screen name="InstructorDetail" component={InstructorDetailScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="TheoreticalCourse" component={TheoreticalCourseScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="SimuladosList" component={SimuladosListScreen} />
      <Stack.Screen name="SimuladoExecution" component={SimuladoExecutionScreen} />
      <Stack.Screen name="SimuladoResult" component={SimuladoResultScreen} />
      <Stack.Screen name="ReferralCampaign" component={ReferralCampaignScreen} />
    </Stack.Navigator>
  );
};