import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useWindowDimensions } from 'react-native';

import { CryptoCrmProvider } from '@/components/crm/crypto-crm-provider';
import { CRM_COLORS } from '@/constants/crm';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1080;

  return (
    <CryptoCrmProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: CRM_COLORS.primary,
          tabBarInactiveTintColor: CRM_COLORS.textMuted,
          tabBarStyle: {
            display: isDesktop ? 'none' : 'flex',
            backgroundColor: CRM_COLORS.surface,
            borderTopColor: CRM_COLORS.border,
          },
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 12,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <MaterialIcons color={color} name="dashboard" size={22} />,
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: 'Portfolio',
            tabBarIcon: ({ color }) => (
              <MaterialIcons color={color} name="account-balance-wallet" size={22} />
            ),
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color }) => <MaterialIcons color={color} name="hub" size={22} />,
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: 'Market',
            tabBarIcon: ({ color }) => <MaterialIcons color={color} name="candlestick-chart" size={22} />,
          }}
        />
      </Tabs>
    </CryptoCrmProvider>
  );
}
