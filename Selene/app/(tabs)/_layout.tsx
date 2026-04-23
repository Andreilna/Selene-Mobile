import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#1E1E1E' },
      tabBarActiveTintColor: '#4CAF50',
      headerShown: false, // Isso remove a barra branca do topo se você não quiser
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Início', 
          tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil', 
          tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Ajustes', 
          tabBarIcon: ({color}) => <Ionicons name="settings" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}