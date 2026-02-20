import React from 'react';
import { View, StyleSheet, Alert, Linking  } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import { InstructorStack } from './InstructorStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../state/authStore';
import { colors } from '../theme';

export type InstructorDrawerParamList = {
  InstructorMain: { screen?: string } | undefined;
};

const Drawer = createDrawerNavigator<InstructorDrawerParamList>();
const WHATSAPP_NUMBER = '5531920019667';

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => await logout(),
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={60} color={colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.full_name || 'Instrutor'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem
        label="Minha Agenda"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="calendar-clock" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorAgenda' })}
      />

      <DrawerItem
        label="Minhas Aulas"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="calendar-check" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorBookings' })}
      />

      <DrawerItem
        label="Perfil"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account-edit" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorProfile' })}
      />

      <DrawerItem
        label="Meus Veículos"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="car" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorVehicles' })}
      />

      <DrawerItem
        label="Financeiro"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="cash" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorFinancial' })}
      />

      <DrawerItem
        label="Mensagens"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="message-text" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('InstructorMain', { screen: 'InstructorMessages' })}
      />

      <DrawerItem
        label="Amigos"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account-group" size={size} color={color} />
        )}
        onPress={() =>
          props.navigation.navigate('InstructorMain', { screen: 'ReferralScreen' })
        }
      />

      <DrawerItem
        label="Suporte"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="help-circle" size={size} color={color} />
        )}
        onPress={() =>
          Alert.alert(
            'Suporte',
            'Escolha como entrar em contato',
            [
              {
                text: 'WhatsApp',
                onPress: () =>
                  Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`),
              },
              {
                text: 'Email',
                onPress: () =>
                  Linking.openURL('mailto:suporte@dirijacerto.com.br'),
              },
              { text: 'Cancelar', style: 'cancel' },
            ]
          )
        }
      />

      <View style={styles.divider} />

      <DrawerItem
        label="Sair"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="logout" size={size} color={colors.error} />
        )}
        labelStyle={{ color: colors.error }}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export const InstructorDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
      }}
    >
      <Drawer.Screen
        name="InstructorMain"
        component={InstructorStack}
        options={{
          title: 'Dirija Mais - Instrutor',
          drawerLabel: 'Início',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          drawerItemPress: (e) => {
            e.preventDefault();
            navigation.navigate('InstructorMain', { screen: 'Dashboard' });
          },
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  avatar: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});