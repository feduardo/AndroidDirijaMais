import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GuestStack } from './GuestStack';
import { StudentDrawer } from './StudentDrawer';
import { InstructorDrawer } from './InstructorDrawer';
import { useAuthStore } from '../state/authStore';
import { UserRole } from '@/domain/entities/User.entity';
import { colors } from '../theme';

export const RootNavigator = () => {
  const { isAuthenticated, user, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Tela de loading enquanto carrega autenticação
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  console.log('🔍 DEBUG AUTH:', {
    isAuthenticated,
    userRole: user?.role,
    userEmail: user?.email,
  });

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <GuestStack />
      ) : user?.role === UserRole.INSTRUCTOR ? (
        <InstructorDrawer />
      ) : (
        <StudentDrawer />
      )}
    </NavigationContainer>
  );
};