import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListaChats() {
  const router = useRouter();

  // Simulação: Se for ADMIN, aparece a lista de usuários. Se for COMUM, aparece o Suporte.
  const chats = [
    { id: '1', nome: 'Suporte Online', status: 'Ativo', time: '14:00' },
    { id: '2', nome: 'Chat Encerrado #01', status: 'Encerrado', time: 'Ontem' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={26} color="#2A3A56" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Suporte Online</Text>
        <View style={styles.headerIcons}>
          <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Conversas Ativas</Text>
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.chatCard} onPress={() => router.push('/suporte/chat')}>
              <View style={styles.avatar}><Feather name="user" size={20} color="#95C159" /></View>
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.nome}</Text>
                <Text style={styles.chatStatus}>{item.status}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold' },
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#999', marginBottom: 20 },
  chatCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', padding: 15, borderRadius: 20, marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  chatInfo: { flex: 1, marginLeft: 15 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  chatStatus: { fontSize: 12, color: '#95C159' },
  chatTime: { fontSize: 12, color: '#999' }
});