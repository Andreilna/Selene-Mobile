import { Stack } from 'expo-router';

export default function SettingsInternalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="notifications" />
      <Stack.Screen name="password" />
      <Stack.Screen name="delete-account" />
    </Stack>
  );
}