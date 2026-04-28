// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      // ==========================================
      // CONFIGURAÇÕES GERAIS DAS TELAS DE AUTH
      // ==========================================
      screenOptions={{ 
        headerShown: false, // Mantém o visual limpo, sem barra de título
        animation: 'fade',  // Transição suave entre Login e Forgot
      }}
    >
      
      {/* ---------------------------------------------------------
          TELA PRINCIPAL DE ACESSO (LOGIN)
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Acessar Selene',
        }}
      />
      
      {/* ---------------------------------------------------------
          TELA DE RECUPERAÇÃO DE SENHA
      ---------------------------------------------------------- */}
      <Stack.Screen 
        name="forgot" 
        options={{
          title: 'Recuperar Senha',
          presentation: 'transparentModal' // Opcional: faz um efeito de sobreposição se preferir
        }}
      />

    </Stack>
  );
}