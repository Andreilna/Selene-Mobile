// (mantive sua estrutura e só corrigi integração)

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
    const token = await SecureStore.getItemAsync("userToken");
    const userId = await SecureStore.getItemAsync("userId");
    setCurrentUserId(userId);

    const res = await axios.get(
      `http://SEU_IP:3000/api/v1/chats/${chatId}/mensagens`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(res.data);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const token = await SecureStore.getItemAsync("userToken");

    const res = await axios.post(
      `http://SEU_IP:3000/api/v1/chats/${chatId}/mensagens`,
      { texto: newMessage },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(prev => [...prev, res.data]);
    setNewMessage("");
  };

  useEffect(() => { fetchMessages(); }, []);
  useEffect(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, [messages]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ScrollView ref={scrollViewRef} style={styles.chatScroll}>
            {messages.map((item) => {
              const isMe = item.autor === currentUserId;

              return (
                <View key={item._id} style={styles.messageRow}>
                  <View style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem
                  ]}>
                    <Text style={isMe ? styles.textMe : styles.textThem}>
                      {item.texto}
                    </Text>
                  </View>
                </View>
              );
            })}
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
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },

  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
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