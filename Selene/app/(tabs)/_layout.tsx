import React from 'react';
import { Tabs } from 'expo-router';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#95C159',
        tabBarInactiveTintColor: '#8E8E8E',
        tabBarStyle: { height: 85, paddingBottom: 15, paddingTop: 10 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início', tabBarIcon: ({ color }) => <SimpleLineIcons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="estufas" options={{ title: 'Estufas', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="greenhouse" size={28} color={color} /> }} />
      <Tabs.Screen name="relatorios" options={{ title: 'Relatórios', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="file-eye-outline" size={26} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações', tabBarIcon: ({ color }) => <SimpleLineIcons name="settings" size={24} color={color} /> }} />
    </Tabs>
  );
}