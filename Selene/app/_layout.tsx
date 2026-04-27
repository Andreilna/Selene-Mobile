import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

// Silencia o aviso da New Architecture que está te incomodando
LogBox.ignoreLogs(['setLayoutAnimationEnabledExperimental is currently a no-op']);

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> 
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="nova-estufa" />
    </Stack>
  );
}