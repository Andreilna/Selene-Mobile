import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#95C159' },
        headerTintColor: '#2A3A56',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="users" options={{ title: 'Gerenciar Usuários' }} />
      <Stack.Screen name="sensors" options={{ title: 'Gerenciar Sensores' }} />
    </Stack>
  );
}