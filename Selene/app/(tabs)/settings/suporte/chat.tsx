import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

/**
 * INTERFACE: Define a estrutura de cada mensagem vinda do backend (Render/PostgreSQL)
 */
interface Message {
  _id: string;
  texto: string;
  remetente: string;
  isAdmin: boolean;
  data: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id: chatId } = useLocalSearchParams(); // Captura o ID do chat via URL dinâmica (ex: suporte/123)
  const scrollViewRef = useRef<ScrollView>(null); // Referência para controlar o scroll automático

  // ==========================================
  // ESTADOS (STATES)
  // ==========================================
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [iniciais, setIniciais] = useState("US");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Geral");

  /**
   * FUNÇÃO: fetchMessages
   * Busca o histórico de mensagens no endpoint do Render.
   */
  const fetchMessages = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");
      setCurrentUserId(userId);

      if (!token || !chatId) return;

      const response = await axios.get(
        `https://selene-mobile.onrender.com/api/v1/suporte/historico/${chatId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      Alert.alert("Erro", "Não foi possível carregar o histórico do chat.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * FUNÇÃO: handleSendMessage
   * Envia a mensagem digitada e atualiza a lista local para feedback imediato.
   */
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Evita enviar apenas espaços

    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token || !chatId) return;

      const response = await axios.post(
        "https://selene-mobile.onrender.com/api/v1/suporte/enviar",
        {
          chatId: chatId,
          texto: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setNewMessage(""); // Limpa o campo de texto
        // Spread operator para adicionar a nova mensagem ao final do array atual
        setMessages((prev) => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    }
  };

  // Carrega as mensagens assim que o componente é montado ou o ID do chat muda
  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  // Sempre que a lista de mensagens aumentar, rola a tela para o final (mensagens novas)
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Formata a string ISO do banco para HH:MM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaProvider>
      {/* Container principal com o verde do cabeçalho */}
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* ---------------------------------------------------------
                       INÍCIO DO HEADER (VERDE SELENE)
                   ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeText}>Configurações</Text>
              <Text style={styles.subwelcomeText}>Notificações</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => router.push("/profile")}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/alertas")}>
                <Feather
                  name="bell"
                  size={24}
                  color="#2A3A56"
                  style={{ marginLeft: 12 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ---------------------------------------------------------
                       FIM DO HEADER
                   ---------------------------------------------------------- */}

        {/* ÁREA DE CONTEÚDO: Fundo claro com bordas arredondadas (Mockup 23) */}
        <View style={styles.content}>
          {/* SELETOR: Alterna entre Assistente IA e FAQ */}
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={[styles.selectorTab, styles.selectorActive]}
            >
              <Text style={styles.selectorTextActive}>Assistente Digital</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectorTab}>
              <Text style={styles.selectorText}>Central De Ajuda</Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE MENSAGENS */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {isLoading ? (
              <Text style={styles.infoText}>Carregando mensagens...</Text>
            ) : messages.length === 0 ? (
              <Text style={styles.infoText}>
                Inicie uma conversa com o suporte.
              </Text>
            ) : (
              messages.map((item) => (
                <View key={item._id} style={styles.messageRow}>
                  {/* Lógica de Balão: 
                      item.isAdmin ? Esquerda (Verde Alface) : Direita (Turquesa Selene) 
                  */}
                  <View
                    style={[
                      styles.bubble,
                      item.isAdmin ? styles.bubbleThem : styles.bubbleMe,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        item.isAdmin ? styles.textThem : styles.textMe,
                      ]}
                    >
                      {item.texto}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.timeText,
                      item.isAdmin ? styles.timeThem : styles.timeMe,
                    ]}
                  >
                    {formatTime(item.data)}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>

          {/* INPUT FIXO: KeyboardAvoidingView evita que o teclado cubra o campo de digitação */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <View style={styles.inputWrapper}>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="camera" size={24} color="#00D2B1" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Digite aqui..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline={false}
              />

              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="mic" size={24} color="#00D2B1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // =============================
  // CONTAINER PRINCIPAL
  // =============================

  container: {
    flex: 1,
    backgroundColor: "#95C159",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 25,
  },

  topContainer: {
    backgroundColor: "#95C159",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 30,
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  subwelcomeText: { fontSize: 14, color: "#2A3A56", opacity: 0.8 },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  avatarText: { fontSize: 16, fontWeight: "bold", color: "#2A3A56" },

  selectorContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    padding: 5,
    marginBottom: 25,
  },
  selectorTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  selectorActive: { backgroundColor: "#2A3A56" },
  selectorTextActive: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  selectorText: { color: "#666", fontSize: 12 },

  chatScroll: { flex: 1 },
  infoText: { textAlign: "center", color: "#AAA", marginTop: 20 },

  messageRow: { marginBottom: 15 },
  bubble: { padding: 15, borderRadius: 20, maxWidth: "80%" },

  // Design específico para mensagens recebidas (Admin)
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    borderTopLeftRadius: 0,
  },
  textThem: { color: "#2A3A56", fontSize: 15 },
  timeThem: { alignSelf: "flex-start", marginLeft: 10 },

  // Design específico para mensagens enviadas (Usuário)
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#00D2B1",
    borderTopRightRadius: 0,
  },
  textMe: { color: "#FFF", fontSize: 15 },
  timeMe: { alignSelf: "flex-end", marginRight: 10 },

  msgText: { lineHeight: 20 },
  timeText: { fontSize: 10, color: "#AAA", marginTop: 5 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 30,
    marginBottom: 15,
    elevation: 5, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconBtn: { padding: 8 },
  input: { flex: 1, height: 40, paddingHorizontal: 15, color: "#2A3A56" },
  sendBtn: {
    backgroundColor: "#00D2B1",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
});
