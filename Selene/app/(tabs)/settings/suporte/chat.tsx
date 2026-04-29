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
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface Message {
  _id: string;
  texto: string;
  autor: string;
  tipo?: "user" | "admin";
  createdAt: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const [iniciais, setIniciais] = useState("US");

  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [role, setRole] = useState<string | null>(null);

  // ================= USER =================
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const nomeSalvo = await SecureStore.getItemAsync("userName");
        if (nomeSalvo) {
          const partes = nomeSalvo.trim().split(" ");

          const init =
            partes.length > 1
              ? (partes[0][0] + partes[1][0]).toUpperCase()
              : partes[0][0].toUpperCase();

          setIniciais(init);
        }
      } catch (e) {
        console.log(e);
      }
    };

    carregarDadosUsuario();
  }, []);

  // ============================
  // PEGAR ROLE E USER
  // ============================

  const loadUserData = async () => {
    const userId = await SecureStore.getItemAsync("userId");

    const userRole = await SecureStore.getItemAsync("userRole");

    setCurrentUserId(userId);
    setRole(userRole);
  };

  // ============================
  // BUSCAR MENSAGENS
  // ============================

  const fetchMessages = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      console.log("ROLE:", role);
      console.log("TOKEN:", token);

      if (!token || !chatId) return;

      let url = "";

      if (role === "admin" || role === "superadmin") {
        url = `https://selene-mobile.onrender.com/api/v1/admin/chats/${chatId}/mensagens`;
      } else {
        url = `https://selene-mobile.onrender.com/api/v1/chats/${chatId}/mensagens`;
      }

      console.log("URL:", url);

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("MENSAGENS:", res.data);

      setMessages(res.data.data || res.data || []);
    } catch (err) {
      console.log("ERRO FETCH MSG:", err);
    }
  };

  // ============================
  // ENVIAR MENSAGEM
  // ============================

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token || !chatId) return;

      let url = "";

      if (role === "admin" || role === "superadmin") {
        url = `https://selene-mobile.onrender.com/api/v1/admin/chats/${chatId}/mensagens`;
      } else {
        url = `https://selene-mobile.onrender.com/api/v1/chats/${chatId}/mensagens`;
      }

      const res = await axios.post(
        url,
        { texto: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const nova = res.data.data || res.data;

      setMessages((prev) => [...prev, nova]);

      setNewMessage("");
    } catch (err) {
      console.log("ERRO SEND STATUS:", err.response?.status);

      console.log("ERRO SEND DATA:", err.response?.data);
    }
  };

  // ============================
  // LOAD
  // ============================

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (role) fetchMessages();
  }, [chatId, role]);

  // ============================
  // AUTO SCROLL
  // ============================

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // ============================
  // UI
  // ============================

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>
            <View>
              <Text style={styles.welcomeText}>Suporte Online</Text>
              <Text style={styles.subwelcomeText}>Chat</Text>
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

        <View style={styles.content}>
          <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
            {messages.map((msg) => {
              const isMe =
                role === "admin" || role === "superadmin"
                  ? msg.tipo === "admin"
                  : msg.autor === currentUserId;

              return (
                <View
                  key={msg._id}
                  style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                  ]}
                >
                  <Text style={isMe ? styles.textMe : styles.textThem}>
                    {msg.texto}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Digite..."
              />

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
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
    marginVertical: 4,
  },

  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
  },

  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#00D2B1",
  },

  textThem: {
    color: "#2A3A56",
  },

  textMe: {
    color: "#FFF",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
  },

  sendBtn: {
    backgroundColor: "#00D2B1",
    marginLeft: 10,
    padding: 10,
    borderRadius: 20,
  },
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
});
