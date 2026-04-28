// app/_layout.tsx
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

// ==========================================================
// CONFIGURAÇÕES GLOBAIS DO AMBIENTE
// ==========================================================

// Silencia o aviso da New Architecture que aparece em builds recentes do Android/iOS
LogBox.ignoreLogs(['setLayoutAnimationEnabledExperimental is currently a no-op']);

export default function RootLayout() {
  return (
    <Stack 
      // Opções globais de cabeçalho (desativado para manter o design customizado)
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // Transição padrão para telas de fluxo
      }}
    >
      
      {/* ---------------------------------------------------------
          FLUXO DE ENTRADA (INDEX / SPLASH / REDIRECT)
      ---------------------------------------------------------- */}
      <Stack.Screen name="index" /> 

      {/* ---------------------------------------------------------
          FLUXO DE AUTENTICAÇÃO (Login, Recuperar Senha)
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="(auth)" 
        options={{
          animation: 'fade', // Transição suave ao entrar no login
        }}
      />

      {/* ---------------------------------------------------------
          FLUXO PRINCIPAL DO APP (Área Logada)
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="(tabs)" 
        options={{
          animation: 'simple_push',
        }}
      />

      {/* ---------------------------------------------------------
          TELAS MODAIS OU FLUXOS ESPECÍFICOS
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="nova-estufa" 
        options={{
          presentation: 'modal', // Abre como uma folha subindo (padrão iOS)
          animation: 'slide_from_bottom'
        }}
      />

    </Stack>
  );
}