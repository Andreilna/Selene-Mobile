import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen
        name="notifications"
        options={{
          title: "Notificações",
        }}
      />

      <Stack.Screen
        name="password"
        options={{
          title: "Alterar Senha",
        }}
      />

      <Stack.Screen
        name="delete-account"
        options={{
          title: "Excluir Conta",
          animation: "fade",
        }}
      />
    </Stack>
  );
}