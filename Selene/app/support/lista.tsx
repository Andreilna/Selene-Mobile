import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

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

  const [role, setRole] = useState<string | null>(null);

  const handleGoProfile = async () => {
    const role = await SecureStore.getItemAsync("userRole");
    const isAdmin = role === "admin" || role === "superadmin";

    router.push(isAdmin ? "/(admin)/profile-admin" : "/(tabs)/profile");
  };

  // =========================
  // CARREGAR USUÁRIO
  // =========================

  useEffect(() => {
    const carregarDadosUsuario = async () => {
      const nomeSalvo = await SecureStore.getItemAsync("userName");

      const userRole = await SecureStore.getItemAsync("userRole");

      setRole(userRole);

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

  // =========================
  // BUSCAR CHATS
  // =========================

  const fetchChats = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        console.log("SEM TOKEN");
        return;
      }

      let url = "";

      if (role === "admin" || role === "superadmin") {
        url = "https://selene-mobile.onrender.com/api/v1/admin/chats";
      } else {
        url = "https://selene-mobile.onrender.com/api/v1/chats";
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      let lista: Chat[] = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (data.data && Array.isArray(data.data)) {
        lista = data.data;
      }

      setChats(lista);
    } catch (err) {
      console.log("ERRO CHATS:", err);
    }
  };

  // =========================
  // ATUALIZA AO VOLTAR
  // =========================

  useFocusEffect(
    useCallback(() => {
      if (role) fetchChats();
    }, [role]),
  );

  // =========================
  // NOVO CHAT
  // =========================

  const iniciarNovoChat = async () => {
    // ADMIN não cria chat
    if (role === "admin") {
      console.log("ADMIN não cria chat");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) return;

      console.log("CRIANDO NOVO CHAT...");

      const res = await fetch(
        "https://selene-mobile.onrender.com/api/v1/chats",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      console.log("NOVO CHAT:", data);

      const chatId = data.data?._id || data._id;

      if (!chatId) {
        console.log("CHAT ID inválido");
        return;
      }

      router.push({
        pathname: "/support/chat",
        params: { chatId },
      });
    } catch (err) {
      console.log("ERRO NOVO CHAT:", err);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <SafeAreaProvider>
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
              <Text style={styles.welcomeText}>Suporte Online</Text>
              <Text style={styles.subwelcomeText}>Suporte</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/alert")}>
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

        {/* LISTA */}

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Conversas</Text>

          {/* LISTA CHATS */}

          <FlatList
            data={chats}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                Nenhum chat ativo
              </Text>
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatCard}
                onPress={() =>
                  router.push({
                    pathname: "/support/chat",
                    params: {
                      chatId: item._id,
                    },
                  })
                }
              >
                <View style={styles.avatar}>
                  <Feather name="user" size={20} color="#95C159" />
                </View>

                <View style={styles.chatInfo}>
                  <Text style={styles.chatName}>{item.nome || "Suporte"}</Text>

                  <Text style={styles.chatStatus}>
                    {item.status || "ativo"}
                  </Text>
                </View>

                <Text style={styles.chatTime}>
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* BOTÃO NOVO CHAT */}

          {role !== "admin" && (
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={iniciarNovoChat}
            >
              <Feather name="plus" size={18} color="#FFF" />

              <Text style={styles.newChatText}>Nova Conversa</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// =========================
// ESTILOS
// =========================

const styles = StyleSheet.create({
  // =========================
  // CONTAINERS PRINCIPAIS
  // =========================
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

  /// =========================
  // HEADER (TOPO VERDE)
  // =========================

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
    marginBottom: 1,
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  subwelcomeText: {
    fontSize: 14,
    color: "#2A3A56",
    opacity: 0.8,
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  // =========================
  // AVATAR
  // =========================
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

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  // =========================
  // TEXTOS / SEÇÕES
  // =========================
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 20,
  },

  // =========================
  // BOTÃO NOVO CHAT
  // =========================
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

  // =========================
  // CARD DE CHAT
  // =========================
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 22,
    marginBottom: 15,
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
