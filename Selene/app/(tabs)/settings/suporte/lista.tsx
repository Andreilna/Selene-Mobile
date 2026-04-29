import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from "expo-secure-store";

export default function ListaChats() {
  const router = useRouter();
  const [iniciais, setIniciais] = useState("US");
  const [chats, setChats] = useState<Chat[]>([]);


  type Chat = {
    _id: string;
    nome: string;
    status: string;
    updatedAt: string;
  };


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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");

        const res = await fetch("http://SEU_IP:3000/api/v1/chats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChats();
  }, []);

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

              <TouchableOpacity>
                <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Conversas Ativas</Text>

          <FlatList
            data={chats}
            keyExtractor={item => item._id}
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
                  <Text style={styles.chatName}>{item.nome}</Text>
                  <Text style={[
                    styles.chatStatus,
                    item.status === 'encerrado' && { color: '#999' }
                  ]}>
                    {item.status}
                  </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },

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

  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  subwelcomeText: { fontSize: 14, color: "#2A3A56" },

  headerIcons: { flexDirection: "row", alignItems: "center" },

  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: { fontSize: 16, fontWeight: "bold" },

  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 20 },

  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 22,
    marginBottom: 15,
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
  chatName: { fontSize: 16, fontWeight: 'bold' },
  chatStatus: { fontSize: 13, color: '#95C159' },
  chatTime: { fontSize: 11, color: '#AAA' }
});