import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="see-profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="novo-usuario" />
      <Stack.Screen name="profile-admin" />
      <Stack.Screen name="sensors" />
      <Stack.Screen name="detalhes-sensor" />
      <Stack.Screen name="detalhes-camera" />
      <Stack.Screen name="edit-sensors" />
      <Stack.Screen name="edit-profile-admin" />
    </Stack>
  );
}
