import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform
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
  createdAt: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const userId = await SecureStore.getItemAsync("userId");

      if (!token || !chatId) return;

      setCurrentUserId(userId);

      const res = await axios.get(
        `https://selene-mobile.onrender.com/api/v1/chats/${chatId}/mensagens`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("MENSAGENS:", res.data);

      setMessages(res.data.data || res.data || []);

    } catch (err) {
      console.log("ERRO FETCH MSG:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token || !chatId) return;

      const res = await axios.post(
        `https://selene-mobile.onrender.com/api/v1/chats/${chatId}/mensagens`,
        { texto: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const nova = res.data.data || res.data;

      setMessages(prev => [...prev, nova]);
      setNewMessage("");

    } catch (err) {
      console.log("ERRO SEND:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>

            <Text style={styles.welcomeText}>Chat</Text>
          </View>
        </View>

        <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
          {messages.map((msg) => (
            <View
              key={msg._id}
              style={[
                styles.bubble,
                msg.autor === currentUserId
                  ? styles.bubbleMe
                  : styles.bubbleThem
              ]}
            >
              <Text style={msg.autor === currentUserId ? styles.textMe : styles.textThem}>
                {msg.texto}
              </Text>
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Digite..."
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

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

  subwelcomeText: {
    fontSize: 14,
    color: "#2A3A56",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 20,
  },

  chatScroll: { flex: 1 },

  messageRow: { marginBottom: 10 },

  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
  },

  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
  },

  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#00D2B1",
  },

  textThem: { color: "#2A3A56" },
  textMe: { color: "#FFF" },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
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
  }
});