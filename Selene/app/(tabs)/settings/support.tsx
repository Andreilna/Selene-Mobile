import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  Alert 
} from 'react-native';
import { Ionicons, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

/**
 * COMPONENTE: SupportScreen
 * OBJETIVO: Oferecer canais de contato e status de integridade do sistema.
 */
export default function SupportScreen() {
  const router = useRouter();
  
  // Estado para armazenar as iniciais do usuário logado (ex: "AL" de Andrei Lucas)
  const [iniciais, setIniciais] = useState('LB');

  /**
   * EFEITO: Carrega as iniciais do usuário a partir do SecureStore
   * Isso garante consistência visual com o restante do Dashboard.
   */
  useEffect(() => {
    const carregarIniciais = async () => {
      try {
        const nome = await SecureStore.getItemAsync('userName');
        if (nome) {
          const partes = nome.trim().split(' ');
          const init = partes.length > 1 
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();
          setIniciais(init);
        }
      } catch (error) {
        console.error("Erro ao recuperar iniciais:", error);
      }
    };
    carregarIniciais();
  }, []);

  /**
   * CONFIGURAÇÃO: Opções de Suporte
   * Centralizamos os dados aqui para facilitar a manutenção e adição de novos canais.
   */
  const supportOptions = [
    { 
      id: '1', 
      title: 'Chat via WhatsApp', 
      subtitle: 'Resposta em até 15 min', 
      icon: 'whatsapp', 
      color: '#25D366',
      // Redireciona o usuário para o app do WhatsApp com o protocolo de URL nativo
      action: () => Linking.openURL('https://wa.me/5513999999999') 
    },
    { 
      id: '2', 
      title: 'E-mail de Suporte', 
      subtitle: 'ajuda@selene.com', 
      icon: 'email-outline', 
      color: '#00D1A0',
      // Abre o cliente de e-mail padrão do celular
      action: () => Linking.openURL('mailto:ajuda@selene.com')
    },
    { 
      id: '3', 
      title: 'Central de Ajuda (FAQ)', 
      subtitle: 'Dúvidas sobre as estufas', 
      icon: 'frequently-asked-questions', 
      color: '#95C159',
      action: () => Alert.alert("FAQ", "Redirecionando para a base de conhecimento no navegador...")
    },
  ];

  return (
    <View style={styles.container}>
      
      {/* ---------------------------------------------------------
          HEADER: Área superior com branding e navegação
      ---------------------------------------------------------- */}
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color="#2A3A56" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Suporte</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
            <Octicons name="bell" size={24} color="#F5F5F5" style={{ marginLeft: 12 }} />
          </View>
        </SafeAreaView>
      </View>

      {/* ---------------------------------------------------------
          CONTEÚDO: Card branco com as opções de contato
      ---------------------------------------------------------- */}
      <View style={styles.contentCard}>
        {/* Intro: Saudação ao usuário */}
        <View style={styles.introBox}>
          <MaterialCommunityIcons name="face-agent" size={48} color="#00D1A0" />
          <Text style={styles.introTitle}>Como podemos ajudar?</Text>
          <Text style={styles.introSub}>
            Nossa equipe de monitoramento está pronta para te auxiliar.
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Mapeamento das opções de suporte definidas no array acima */}
          {supportOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.optionItem}
              onPress={option.action}
              activeOpacity={0.6}
            >
              <View style={[styles.iconBox, { backgroundColor: option.color }]}>
                <MaterialCommunityIcons name={option.icon as any} size={24} color="#FFF" />
              </View>
              
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSub}>{option.subtitle}</Text>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          ))}

          {/* INDICADOR DE STATUS: Transmite confiança técnica ao usuário */}
          <View style={styles.statusBox}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sistemas Operacionais: 100%</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  // Design curvo do cabeçalho que sobrepõe o card branco
  topSection: { 
    backgroundColor: '#95C159', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    paddingBottom: 60, 
    paddingHorizontal: 25 
  },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  // Avatar minimalista com iniciais dinâmicas
  avatarCircle: { 
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#EDFCED', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { fontSize: 11, fontWeight: 'bold', color: '#2A3A56' },

  // Card principal elevado com sombra leve
  contentCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -30, // Cria o efeito de sobreposição no cabeçalho verde
    marginHorizontal: 20, 
    marginBottom: 20,
    borderRadius: 30, 
    padding: 25, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },

  introBox: { alignItems: 'center', marginBottom: 35, marginTop: 5 },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginTop: 10 },
  introSub: { fontSize: 13, color: '#8E8E8E', textAlign: 'center', marginTop: 8, paddingHorizontal: 10 },

  // Estilização das linhas de opção (Cards internos)
  optionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9FBF9', 
    padding: 16, 
    borderRadius: 22, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  iconBox: { width: 45, height: 45, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  optionTextContainer: { flex: 1, marginLeft: 15 },
  optionTitle: { fontSize: 15, fontWeight: 'bold', color: '#2A3A56' },
  optionSub: { fontSize: 12, color: '#8E8E8E', marginTop: 2 },

  // Barra de status no rodapé
  statusBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20,
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 18
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00D1A0', marginRight: 10 },
  statusText: { fontSize: 12, color: '#2A3A56', fontWeight: '600' }
});