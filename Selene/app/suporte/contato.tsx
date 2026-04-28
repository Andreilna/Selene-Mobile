import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  UIManager 
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';

export default function ContatoScreen() {
  const router = useRouter();
  const [iniciais, setIniciais] = useState('AL');

  // Recupera iniciais do usuário logado para manter a identidade visual do Selene
  useEffect(() => {
    const loadUser = async () => {
      const nome = await SecureStore.getItemAsync('userName');
      if (nome) {
        const partes = nome.trim().split(' ');
        setIniciais(partes.length > 1 ? (partes[0][0] + partes[1][0]).toUpperCase() : partes[0][0].toUpperCase());
      }
    };
    loadUser();
  }, []);

  /**
   * Mapeamento das Redes Sociais:
   * A cor é usada tanto no ícone quanto no fundo (com 20% de opacidade no estilo).
   */
  const socialOptions = [
    { name: 'Instagram', icon: 'instagram', color: '#E1306C' },
    { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
    { name: 'Facebook', icon: 'facebook', color: '#4267B2' },
    { name: 'E-mail', icon: 'envelope', color: '#00D2B1' },
  ];

  return (
    <SafeAreaProvider>
      {/* SafeAreaView com fundo verde Selene (95C159) */}
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* ---------------------------------------------------------
            HEADER: Padronizado com as outras telas do sistema
        ---------------------------------------------------------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#2A3A56" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Central De Ajuda</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>{iniciais}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------------------------------------------------------
            CONTENT: Card branco com bordas superiores arredondadas
        ---------------------------------------------------------- */}
        <View style={styles.content}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Text style={styles.subTitle}>Como Podemos Ajudar?</Text>

            {/* SELETOR (TAB): Alterna entre visualização de FAQ e Contato */}
            <View style={styles.topToggle}>
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => router.push('/suporte')} // Redireciona para a lista de FAQ
              >
                <Text style={styles.toggleText}>FAQ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]}>
                <Text style={styles.toggleTextActive}>Nos Contate</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE OPÇÕES SOCIAIS: Renderizada via map para código mais limpo */}
            <View style={styles.socialList}>
              {socialOptions.map((item, index) => (
                <TouchableOpacity key={index} style={styles.socialItem} activeOpacity={0.7}>
                  {/* Container do ícone com cor dinâmica e fundo suave (Hex + '20' = 20% alpha) */}
                  <View style={[styles.socialIcon, { backgroundColor: item.color + '20' }]}>
                    <FontAwesome5 name={item.icon} size={20} color={item.color} />
                  </View>
                  
                  <Text style={styles.socialName}>{item.name}</Text>
                  
                  <Feather name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>

            {/* BOTÃO DE AÇÃO PRINCIPAL: Focado no suporte direto do Selene */}
            <TouchableOpacity 
              style={styles.btnChat} 
              onPress={() => router.push('/suporte/chat')} // Abre a tela de chat online
            >
              <Text style={styles.btnText}>Suporte ao Produtor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 12 },
  
  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 25 
  },
  
  subTitle: { 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2A3A56', 
    marginBottom: 20 
  },
  
  // Estilo do seletor FAQ/Contato (Estilo pílula)
  topToggle: { 
    flexDirection: 'row', 
    backgroundColor: '#F5F5F5', 
    borderRadius: 15, 
    padding: 5, 
    marginBottom: 30 
  },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleActive: { backgroundColor: '#00D2B1' }, // Verde Selene Vibrante
  toggleTextActive: { color: '#FFF', fontWeight: 'bold' },
  toggleText: { color: '#2A3A56' },

  socialList: { flex: 1 },
  socialItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  socialIcon: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  socialName: { flex: 1, fontSize: 16, color: '#2A3A56', fontWeight: '600' },
  
  // Botão de destaque inferior
  btnChat: { 
    backgroundColor: '#00D2B1', 
    height: 55, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 10,
    elevation: 2, // Sombra leve no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});