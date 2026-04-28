import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * COMPONENTE: ListaChats
 * OBJETIVO: Listar as sessões de suporte (ativas e encerradas).
 * Este componente serve como o "Inbox" de mensagens do usuário no Selene.
 */
export default function ListaChats() {
  const router = useRouter();

  /**
   * MOCKUP DE DADOS: Simula o retorno da API.
   * Em um cenário real, você buscaria isso via axios.get no useEffect.
   * id: Identificador único da sessão
   * status: Define a cor e o rótulo visual (Ativo/Encerrado)
   */
  const chats = [
    { id: '1', nome: 'Suporte Online', status: 'Ativo', time: '14:00' },
    { id: '2', nome: 'Chat Encerrado #01', status: 'Encerrado', time: 'Ontem' },
  ];

  return (
    // Fundo Verde Alface (95C159) para manter o branding do app
    <SafeAreaView style={styles.container}>
      
      {/* ---------------------------------------------------------
          HEADER: Navegação superior simplificada
      ---------------------------------------------------------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Feather name="arrow-left" size={26} color="#2A3A56" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Suporte Online</Text>
        
        {/* Espaçador/Perfil para manter o equilíbrio visual do header */}
        <View style={styles.headerIcons}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>AL</Text> 
          </View>
        </View>
      </View>

      {/* ---------------------------------------------------------
          CONTEÚDO: Lista de cards com FlatList (Melhor performance)
      ---------------------------------------------------------- */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Conversas Ativas</Text>
        
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            /**
             * CARD DE CHAT:
             * Redireciona o usuário para a tela de mensagens específica.
             */
            <TouchableOpacity 
              style={styles.chatCard} 
              onPress={() => router.push(`/suporte/chat?id=${item.id}`)}
              activeOpacity={0.6}
            >
              {/* Avatar genérico com fundo verde suave */}
              <View style={styles.avatar}>
                <Feather name="user" size={20} color="#95C159" />
              </View>
              
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.nome}</Text>
                {/* O status muda de cor dinamicamente se for encerrado */}
                <Text style={[
                  styles.chatStatus, 
                  item.status === 'Encerrado' && { color: '#999' }
                ]}>
                  {item.status}
                </Text>
              </View>
              
              <Text style={styles.chatTime}>{item.time}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
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
  
  // Card principal branco com bordas curvas de 40px
  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 25 
  },
  
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#999', 
    marginBottom: 20, 
    textTransform: 'uppercase' 
  },

  // Estilização do card individual de chat
  chatCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 22, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#E8F5E9', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  chatInfo: { flex: 1, marginLeft: 15 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  chatStatus: { fontSize: 13, color: '#95C159', marginTop: 2 },
  chatTime: { fontSize: 11, color: '#AAA' }
});