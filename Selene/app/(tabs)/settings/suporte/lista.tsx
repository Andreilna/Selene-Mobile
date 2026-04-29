import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from "expo-secure-store";

type Chat = {
  _id: string;
  nome?: string;
  status?: string;
  updatedAt?: string;
};

export default function ListaChats() {
  const router = useRouter();
  const [iniciais, setIniciais] = useState("US");
  const [chats, setChats] = useState<Chat[]>([]);

  // ================= USER =================
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      const nomeSalvo = await SecureStore.getItemAsync("userName");
      if (nomeSalvo) {
        const partes = nomeSalvo.trim().split(" ");
        const init =
          partes.length > 1
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();
        setIniciais(init);
      }
    };
    carregarDadosUsuario();
  }, []);

  // ================= CHATS =================
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        if (!token) {
          console.log("SEM TOKEN");
          return;
        }

        console.log("TOKEN:", token);

        const res = await fetch("https://selene-mobile.onrender.com/api/v1/chats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        console.log("CHATS:", data);

        setChats(data.data || data || []);

      } catch (err) {
        console.log("ERRO CHATS:", err);
      }
    };

    fetchChats();
  }, []);

  // ================= NOVO CHAT =================
  const iniciarNovoChat = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        console.log("SEM TOKEN");
        return;
      }

      const res = await fetch("https://selene-mobile.onrender.com/api/v1/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      console.log("NOVO CHAT:", data);

      const chatId = data.data?._id || data._id;

      if (!chatId) {
        console.log("CHAT ID inválido");
        return;
      }

      router.push({
        pathname: "/(tabs)/settings/suporte/chat",
        params: { chatId }
      });

    } catch (err) {
      console.log("ERRO NOVO CHAT:", err);
    }
  };

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
              <Text style={styles.subwelcomeText}>Suporte</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
              <Feather name="bell" size={24} color="#2A3A56" />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Conversas</Text>

          <TouchableOpacity style={styles.newChatButton} onPress={iniciarNovoChat}>
            <Feather name="plus" size={18} color="#FFF" />
            <Text style={styles.newChatText}>Nova Conversa</Text>
          </TouchableOpacity>

          <FlatList
            data={chats}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatCard}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/settings/suporte/chat",
                    params: { chatId: item._id }
                  })
                }
              >
                <View style={styles.avatar}>
                  <Feather name="user" size={20} color="#95C159" />
                </View>

                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{item.nome || "Suporte"}</Text>
                  <Text style={styles.chatStatus}>{item.status || "ativo"}</Text>
                </View>

                <Text style={styles.chatTime}>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : ""}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ================= ESTILOS =================
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

  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00D2B1",
    padding: 14,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },

  newChatText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 22,
    marginBottom: 15,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },

  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },

  chatStatus: {
    fontSize: 13,
    color: "#95C159",
  },

  chatTime: {
    fontSize: 11,
    color: "#AAA",
  },
});
