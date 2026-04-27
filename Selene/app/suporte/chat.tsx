import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons'; // Importando ícones Feather e Ionicons
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Interface para tipar as mensagens vindas da API
interface Message {
  _id: string;
  texto: string;
  remetente: string;
  isAdmin: boolean;
  data: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams(); // Pega o ID do chat via rota
  const scrollViewRef = useRef<ScrollView>(null);

  // Estados da tela
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Função para buscar o histórico de mensagens
  const fetchMessages = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      // Supomos que você salvou o ID do usuário logado no login
      const userId = await SecureStore.getItemAsync('userId'); 
      setCurrentUserId(userId);

      if (!token || !chatId) return;

      const response = await axios.get(`https://selene-mobile.onrender.com/api/v1/suporte/historico/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico do chat.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para enviar uma nova mensagem
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Não envia mensagem vazia

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token || !chatId) return;

      const response = await axios.post('https://selene-mobile.onrender.com/api/v1/suporte/enviar', {
        chatId: chatId,
        texto: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setNewMessage(''); // Limpa o input
        // Adiciona a mensagem enviada localmente para feedback imediato
        setMessages(prev => [...prev, response.data.data]); 
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
    }
  };

  // Carrega as mensagens ao abrir a tela e rola para o final
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    // Rola para o final quando novas mensagens chegam
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Função auxiliar para formatar a hora (Ex: 14:00)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER SELENE (Idêntico ao mockup 23) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={26} color="#2A3A56" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Suporte Online</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>LB</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ÁREA DE CONVERSA (Fundo claro arredondado) */}
        <View style={styles.content}>
          
          {/* SELETOR (Simulado do mockup) */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity style={[styles.selectorTab, styles.selectorActive]}><Text style={styles.selectorTextActive}>Assistente Digital</Text></TouchableOpacity>
            <TouchableOpacity style={styles.selectorTab}><Text style={styles.selectorText}>Central De Ajuda</Text></TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <Text style={styles.infoText}>Carregando mensagens...</Text>
            ) : messages.length === 0 ? (
              <Text style={styles.infoText}>Inicie uma conversa com o suporte.</Text>
            ) : (
              messages.map((item) => (
                <View key={item._id} style={styles.messageRow}>
                  {/* Lógica de Balão: Se foi o Admin, balão verde claro à esquerda. Se foi o usuário logado, balão turquesa à direita. */}
                  <View style={[
                    styles.bubble, 
                    item.isAdmin ? styles.bubbleThem : styles.bubbleMe
                  ]}>
                    <Text style={[styles.msgText, item.isAdmin ? styles.textThem : styles.textMe]}>
                      {item.texto}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, item.isAdmin ? styles.timeThem : styles.timeMe]}>
                    {formatTime(item.data)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* BARRA DE INPUT (Idêntica ao rodapé do mockup 23) */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <View style={styles.inputWrapper}>
              {/* Botões de Mídia (Câmera e Microfone como na imagem) */}
              <TouchableOpacity style={styles.iconBtn}><Feather name="camera" size={24} color="#00D2B1" /></TouchableOpacity>
              
              {/* Campo de Texto */}
              <TextInput 
                style={styles.input} 
                placeholder="Digite aqui..." 
                value={newMessage}
                onChangeText={setNewMessage}
                multiline={false} // Mantém uma linha como no mockup
              />
              
              <TouchableOpacity style={styles.iconBtn}><Feather name="mic" size={24} color="#00D2B1" /></TouchableOpacity>
              
              {/* Botão de Enviar (Círculo Turquesa) */}
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ESTILIZAÇÃO COMPLETA
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' }, // Fundo Verde Alface do header
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },
  
  // Conteúdo Branco Arredondado
  content: { flex: 1, backgroundColor: '#F4F9F1', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 20, paddingTop: 25 },
  
  // Seletor (Assistente / Central)
  selectorContainer: { flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 15, padding: 5, marginBottom: 25 },
  selectorTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  selectorActive: { backgroundColor: '#2A3A56' },
  selectorTextActive: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  selectorText: { color: '#666', fontSize: 12 },
  
  // Área do Chat
  chatScroll: { flex: 1 },
  infoText: { textAlign: 'center', color: '#AAA', marginTop: 20 },
  
  // Balões de Mensagem
  messageRow: { marginBottom: 15 },
  bubble: { padding: 15, borderRadius: 20, maxWidth: '80%' },
  
  // Balão Deles (Admin/Assistente) - Verde Claro
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderTopLeftRadius: 0 },
  textThem: { color: '#2A3A56', fontSize: 15 },
  timeThem: { alignSelf: 'flex-start', marginLeft: 10 },
  
  // Balão Meu (Usuário) - Turquesa/Verde Água
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: '#00D2B1', borderTopRightRadius: 0 },
  textMe: { color: '#FFF', fontSize: 15 },
  timeMe: { alignSelf: 'flex-end', marginRight: 10 },
  
  msgText: { lineHeight: 20 },
  timeText: { fontSize: 10, color: '#AAA', marginTop: 5 },
  
  // Barra de Input (Rodapé)
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 30, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  iconBtn: { padding: 8 },
  input: { flex: 1, height: 40, paddingHorizontal: 15, color: '#2A3A56' },
  sendBtn: { backgroundColor: '#00D2B1', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }
});