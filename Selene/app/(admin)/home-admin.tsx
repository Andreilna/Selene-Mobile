import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AdminHome() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Administrador");
  const [iniciais, setIniciais] = useState("US");
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  // ==========================================
  // LÓGICA DE CARREGAMENTO (STORAGE/API)
  // ==========================================
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const nomeSalvo = await SecureStore.getItemAsync("userName");
        if (nomeSalvo) {
          const partes = nomeSalvo.trim().split(" ");
          const primeiroSegundo =
            partes.length > 1 ? `${partes[0]} ${partes[1]}` : partes[0];
          setNomeUsuario(primeiroSegundo);

          const init =
            partes.length > 1
              ? (partes[0][0] + partes[1][0]).toUpperCase()
              : partes[0][0].toUpperCase();
          setIniciais(init);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do SecureStore", e);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosUsuario();
  }, []);

  const MenuButton = ({ title, subtitle, icon, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* ---------------------------------------------------------
                INÍCIO DO HEADER (VERDE SELENE)
            ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          {/* SAUDAÇÃO E PERFIL */}
          <View style={styles.header}>
            <View>
              {loading ? (
                <ActivityIndicator size="small" color="#2A3A56" />
              ) : (
                <>
                  <Text style={styles.welcomeText}>Olá, {nomeUsuario}</Text>
                  <Text style={styles.subwelcomeText}>
                    Bem-vindo novamente!
                  </Text>
                </>
              )}
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => router.push("/(admin)/perfile-admin")}
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

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Produtores Online</Text>
            <Text style={styles.statValue}>120</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sensores Operantes</Text>
            <Text style={[styles.statValue, { color: "#2A3A56" }]}>23</Text>
          </View>
        </View>

        {/* Lista de Opções (Corpo Branco Arredondado) */}
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <MenuButton
              title="Controle de Acessos"
              subtitle="Informações sobre usuários ativos no sistema."
              icon={
                <MaterialCommunityIcons
                  name="account-cog-outline"
                  size={24}
                  color="#FFF"
                />
              }
              onPress={() => router.push("/(admin)/users")}
            />

            <MenuButton
              title="Controle Sensores"
              subtitle="Medir o controle dos sensores em campo."
              icon={<Feather name="cpu" size={24} color="#FFF" />}
              onPress={() => router.push("/(admin)/sensors")}
            />

            <MenuButton
              title="Atualizações de Suporte"
              subtitle="Solicitações de suporte dos produtores."
              icon={
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={24}
                  color="#FFF"
                />
              }
              onPress={() => router.push("/support/lista")}
            />

            <MenuButton
              title="Notas de Atualização"
              subtitle="Acompanhe as atualizações recentes da aplicação."
              icon={<Feather name="gift" size={24} color="#FFF" />}
              onPress={() => router.push("/#")}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // ================= HEADER =================
  container: { flex: 1, backgroundColor: "#95C159" },

  // Header Superior
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

  // Painel Branco Arredondado
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 40,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  greeting: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  profileInitials: { fontWeight: "bold", color: "#2A3A56" },

  notificationBtn: {
    backgroundColor: "#FFF",
    padding: 8,
    borderRadius: 20,
  },

  // ================= STATS =================
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    alignItems: "center", // 👈 CENTRALIZA TUDO
  },

  statLabel: {
    color: "#2A3A56",
    fontSize: 13,
    marginBottom: 5,
  },

  statValue: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 20,
  },

  // ================= CARD / MENU =================
  card: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",

    // Sombra
    elevation: 3, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#2A3A56",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  textContainer: { flex: 1 },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
  },
});
