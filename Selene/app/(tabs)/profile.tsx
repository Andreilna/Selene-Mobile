import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  Ionicons,
  Octicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [iniciais, setIniciais] = useState("US");

  const [userData, setUserData] = useState({
    nome: "",
    id: "",
    iniciais: "",
  });

// ==========================================
// LOAD USER DATA + INICIAIS
// ==========================================
useEffect(() => {
  const loadUserData = async () => {
    try {
      const nomeCompleto = await SecureStore.getItemAsync("userName");
      const userId = await SecureStore.getItemAsync("userId");
      const role = await SecureStore.getItemAsync("userRole");

      setIsAdmin(role === "admin");

      if (nomeCompleto) {
        const partes = nomeCompleto.trim().split(" ");

        const init =
          partes.length > 1
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();

        // mantém os dois estados que você já usava
        setIniciais(init);

        setUserData({
          nome: nomeCompleto,
          id: userId ? userId.substring(0, 8) : "25030024",
          iniciais: init,
        });
      }
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
    } finally {
      setLoading(false);
    }
  };

  loadUserData();
}, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userRole");
          router.replace("/(auth)");
        },
      },
    ]);
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* ---------------------------------------------------------
                  INÍCIO DO HEADER (VERDE SELENE)
              ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Perfil</Text>
              <Text style={styles.subwelcomeText}></Text>
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

        {/* ---------------------------------------------------------
          CARD DE PERFIL (BRANCO FLUTUANTE)
      ---------------------------------------------------------- */}
        <View style={styles.content}>
          {/* FOTO DE PERFIL CIRCULAR */}
          <View style={styles.imageContainer}>
            <Image
              source="https://i.pravatar.cc/300"
              style={styles.profileImage}
            />
          </View>

          {/* NOME E ID DO USUÁRIO */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#95C159"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Text style={styles.userName}>{userData.nome}</Text>
              <Text style={styles.userId}>ID: {userData.id}</Text>
            </>
          )}

          <ScrollView
            style={styles.menuList}
            showsVerticalScrollIndicator={false}
          >
            {/* SEÇÃO ADMINISTRATIVA (Condicional: só aparece para Admin) */}
            {isAdmin && (
              <View style={styles.adminSection}>
                <Text style={styles.sectionLabel}>Administração</Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/admin/users")}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: "#2A3A56" },
                    ]}
                  >
                    <Ionicons name="people-outline" size={22} color="#FFF" />
                  </View>
                  <Text style={styles.menuText}>Gerenciar Usuários</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => router.push("/admin/sensors")}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: "#2A3A56" },
                    ]}
                  >
                    <Ionicons
                      name="hardware-chip-outline"
                      size={22}
                      color="#FFF"
                    />
                  </View>
                  <Text style={styles.menuText}>Gerenciar Sensores</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            )}

            {/* SEÇÃO DE CONFIGURAÇÕES PADRÃO */}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/(tabs)/edit-profile")}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#95C159" },
                ]}
              >
                <Ionicons name="person-outline" size={22} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/settings/password")}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#95C159" },
                ]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#FFF"
                />
              </View>
              <Text style={styles.menuText}>Segurança</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#95C159" },
                ]}
              >
                <Ionicons name="headset-outline" size={22} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Suporte</Text>
            </TouchableOpacity>

            {/* BOTÃO DE LOGOUT */}
            <TouchableOpacity
              style={[styles.menuItem, { marginTop: 10 }]}
              onPress={handleLogout}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#FF4B4B" },
                ]}
              >
                <MaterialCommunityIcons name="logout" size={22} color="#FFF" />
              </View>
              <Text style={[styles.menuText, { color: "#FF4B4B" }]}>
                Sair da Conta
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* ---------------------------------------------------------
          FIM DO CARD DE PERFIL
      ---------------------------------------------------------- */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// ESTILOS (STYLESHEET)
// ==========================================
const styles = StyleSheet.create({
  // ==========================================
  // ESTRUTURA PRINCIPAL
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: "#95C159",
  },

  // ==========================================
  // HEADER (FUNDO VERDE)
  // ==========================================
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

  // ==========================================
  // CARD DE PERFIL (BRANCO FLUTUANTE)
  // ==========================================
  profileCard: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: -40,
    marginHorizontal: 20,
    borderRadius: 40,
    paddingTop: 70,
    marginBottom: 20,
    elevation: 5,
  },

  imageContainer: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 65,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
    textAlign: "center",
  },

  userId: {
    fontSize: 14,
    color: "#2A3A56",
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 25,
  },

  // ==========================================
  // MENU / LISTA
  // ==========================================
  menuList: {
    paddingHorizontal: 25,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#A0A0A0",
    textTransform: "uppercase",
    marginBottom: 15,
    marginLeft: 5,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A3A56",
  },

  // ==========================================
  // SEÇÃO ADMIN
  // ==========================================
  adminSection: {
    marginBottom: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },

  // ==========================================
  // ESTILOS COMPARTILHADOS (PODERIAM SER EXTERNOS)
  // ==========================================
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 80,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },
});
