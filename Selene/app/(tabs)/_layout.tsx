import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarStyle: { backgroundColor: '#1E1E1E', borderTopWidth: 0 },
      tabBarActiveTintColor: '#4CAF50',
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff'
    }}>
      {/* IMPORTANTE: O 'name' deve ser exatamente o nome do arquivo .tsx 
         que está na mesma pasta que este _layout.
      */}
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