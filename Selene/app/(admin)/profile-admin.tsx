import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [iniciais, setIniciais] = useState("US");

  const [userData, setUserData] = useState({
    nome: "",
    id: "",
    iniciais: "",
  });

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          setLoading(true);

          const nomeCompleto = await SecureStore.getItemAsync("userName");
          const userId = await SecureStore.getItemAsync("userId");
          const role = await SecureStore.getItemAsync("userRole");

          setIsAdmin(role === "admin" || role === "superadmin");

          if (nomeCompleto) {
            const partes = nomeCompleto.trim().split(/\s+/);

            const init =
              partes.length > 1
                ? (partes[0][0] + partes[1][0]).toUpperCase()
                : partes[0][0].toUpperCase();

            setIniciais(init);

            setUserData({
              nome: nomeCompleto,
              id: userId ? userId.substring(0, 8) : "--------",
              iniciais: init,
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      loadUserData();
    }, []),
  );

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("userRole");
            await SecureStore.deleteItemAsync("userName");
            await SecureStore.deleteItemAsync("userEmail");
            await SecureStore.deleteItemAsync("userId");

            router.replace("/(auth)");
          } catch (e) {
            console.error(
              "Erro ao deslogar:",
              e instanceof Error ? e.message : e,
            );
          }
        },
      },
    ]);
  };

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
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Perfil</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* ---------------------------------------------------------
                FIM DO HEADER
            ---------------------------------------------------------- */}

        {/* CONTEÚDO */}
        <View style={styles.content}>
          {/* FOTO */}
          <View style={styles.imageContainer}>
            <Image
              source="https://i.pravatar.cc/300"
              style={styles.profileImage}
            />
          </View>

          {/* DADOS */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#95C159"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Text style={styles.userName}>{userData.nome || "Usuário"}</Text>
              <Text style={styles.userId}>ID: {userData.id}</Text>
            </>
          )}

          {/* MENU */}
          <ScrollView
            style={styles.menuList}
            showsVerticalScrollIndicator={false}
          >
            {/* EDITAR PERFIL */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                const userId = await SecureStore.getItemAsync("userId");

                router.push({
                  pathname: "/(admin)/edit-profile-admin",
                  params: { id: userId || "" },
                });
              }}
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

            {/* SEGURANÇA */}
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

            {/* SUPORTE */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push("/support/lista")}
            >
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

            {/* LOGOUT */}
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// -------------------
// Main Container & Layout
// -------------------

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
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  // -------------------
  // Header Section
  // -------------------

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
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
    textAlign: "left",
  },
  subwelcomeText: {
    fontSize: 14,
    color: "#2A3A56",
    opacity: 0.8,
  },

  // -------------------
  // Avatar Components
  // -------------------

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

  // -------------------
  // Profile Card & Image
  // -------------------

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

  // -------------------
  // Menu List Section
  // -------------------

  menuList: {
    paddingHorizontal: 25,
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#A0A0A0",
    textTransform: "uppercase",
    marginBottom: 15,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },
  adminSection: {
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
});
