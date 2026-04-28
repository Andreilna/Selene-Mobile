// app/(tabs)/settings/_layout.tsx (ou caminho correspondente)
import { Stack } from 'expo-router';

/**
 * LAYOUT INTERNO DE CONFIGURAÇÕES
 * Gerencia a navegação entre as sub-telas de ajuste do perfil.
 */
export default function SettingsInternalLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, 
        animation: 'slide_from_right' // Mantém a consistência de "profundidade" na navegação
      }}
    >
      
      {/* ---------------------------------------------------------
          AJUSTES DE NOTIFICAÇÕES (PUSH, ALERTAS)
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="notifications" 
        options={{
          title: 'Notificações',
        }}
      />
      
      {/* ---------------------------------------------------------
          SEGURANÇA: TROCA DE SENHA
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="password" 
        options={{
          title: 'Alterar Senha',
        }}
      />
      
      {/* ---------------------------------------------------------
          ZONA DE PERIGO: EXCLUSÃO DE CONTA
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="delete-account" 
        options={{
          title: 'Excluir Conta',
          animation: 'fade', // Um efeito diferente para alertar sobre a gravidade da tela
        }}
      />

    </Stack>
  );
}