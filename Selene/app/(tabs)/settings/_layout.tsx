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
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="password"
        options={{
          title: "Alterar Senha",
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="suporte/index"
        options={{
          title: "Suporte",
          animation: "fade",
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