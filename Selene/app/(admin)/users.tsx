import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

// ==========================
// TYPES
// ==========================
interface Usuario {
  id: string;
  nome: string;
  data: string;
  cargo: string;
  codigo: string;
}

export default function ControleAcessoScreen() {
  const router = useRouter();

  const [filterActive, setFilterActive] = useState("Dia");
  const [iniciais, setIniciais] = useState("US");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
      } catch (e) {}
    };

    carregarDadosUsuario();
  }, []);

  // ================= TOKEN =================
  useEffect(() => {
    const loadToken = async () => {
      const t = await SecureStore.getItemAsync("userToken");
      setToken(t);
    };

    loadToken();
  }, []);

  // ================= FETCH USERS =================
  const fetchUsuarios = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetch(
        "https://selene-mobile.onrender.com/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      let lista =
        data?.data?.usuarios || data?.data || data?.usuarios || data || [];

      if (!Array.isArray(lista)) {
        lista = [];
      }

      const formatados = lista.map((u: any, index: number) => {
        let nomeBase = u.nome_completo || u.nome || u.name || u.usuario;

        if (!nomeBase && u.email) {
          nomeBase = u.email.split("@")[0];
        }

        return {
          id: u._id || u.id || index.toString(),
          nome: nomeBase || "Usuário",
          data: "Agora",
          cargo: u.role || "Produtor",
          codigo: (u._id || "").slice(-6),
        };
      });

      setUsuarios(formatados);
    } catch (err) {
      console.log("Erro ao buscar usuários", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
  };

  const timeFilters = ["Dia", "Semana", "Mês", "Ano"];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Controle Acessos</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/alert")}>
                <Feather name="bell" size={24} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStatCard}>
            <Text style={styles.statLabelLink}>Usuários Cadastrados</Text>
            <Text style={styles.statValueBig}>{usuarios.length}</Text>
          </View>

          <View style={styles.secondaryStatsRow}>
            <View style={styles.subStat}>
              <View style={styles.subStatLabelRow}>
                <Feather name="external-link" size={14} color="#2A3A56" />
                <Text style={styles.subStatLabel}>Online Atualmente</Text>
              </View>
              <Text style={styles.subStatValue}>{usuarios.length}</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.subStat}>
              <View style={styles.subStatLabelRow}>
                <Feather name="corner-right-down" size={14} color="#2A3A56" />
                <Text style={styles.subStatLabel}>Pendente Validação</Text>
              </View>
              <Text style={[styles.subStatValue, { color: "#2D9CDB" }]}>
                --
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* FILTRO */}
          <View style={styles.timeFilterContainer}>
            {timeFilters.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.timeBtn,
                  filterActive === item && styles.timeBtnActive,
                ]}
                onPress={() => setFilterActive(item)}
              >
                <Text
                  style={[
                    styles.timeBtnText,
                    filterActive === item && styles.timeBtnTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* HEADER LISTA */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Usuários</Text>
            <TouchableOpacity style={styles.filterIconBtn}>
              <MaterialIcons name="filter-list" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* LISTA */}
          {loadingUsers ? (
            <ActivityIndicator size="large" color="#00D2B1" />
          ) : (
            <FlatList
              data={usuarios}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <View style={styles.userCard}>
                  <View style={styles.userIconContainer}>
                    <Feather name="user" size={24} color="#FFF" />
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.nome}</Text>
                    <Text style={styles.userData}>{item.data}</Text>
                  </View>

                  <View style={styles.roleContainer}>
                    <View style={styles.verticalLine} />
                    <Text style={styles.roleText}>{item.cargo}</Text>
                    <View style={styles.verticalLine} />
                  </View>

                  <Text style={styles.userCode}>{item.codigo}</Text>
                </View>
              )}
            />
          )}

          {/* BOTÃO */}
          <TouchableOpacity
            style={styles.btnNewUser}
            onPress={() => router.push("/(admin)/novo-usuario")}
          >
            <Text style={styles.btnNewUserText}>Novo Cadastro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================
// STYLE (igual ao seu)
// ==========================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },

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

  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },

  headerIcons: { flexDirection: "row", alignItems: "center", gap: 15 },

  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: { fontSize: 16, fontWeight: "bold", color: "#2A3A56" },

  textContainer: { flex: 1, marginLeft: 20 },

  statsContainer: { paddingHorizontal: 25, marginBottom: 25 },

  mainStatCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },

  statLabelLink: {
    color: "#2A3A56",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },

  statValueBig: { fontSize: 32, fontWeight: "bold", color: "#2A3A56" },

  secondaryStatsRow: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },

  subStat: { flex: 1, alignItems: "center" },

  subStatLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  subStatLabel: { fontSize: 12, color: "#2A3A56", marginLeft: 5 },

  subStatValue: { fontSize: 24, fontWeight: "bold", color: "#FFF" },

  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#FFF",
    opacity: 0.5,
  },

  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  timeFilterContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F5F0",
    borderRadius: 20,
    padding: 5,
    marginBottom: 25,
  },

  timeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 15,
  },

  timeBtnActive: { backgroundColor: "#00D2B1" },

  timeBtnText: { color: "#2A3A56", fontSize: 13 },

  timeBtnTextActive: { color: "#FFF", fontWeight: "bold" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#2A3A56" },

  filterIconBtn: { backgroundColor: "#00D2B1", padding: 6, borderRadius: 10 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  userIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#00D2B1",
    justifyContent: "center",
    alignItems: "center",
  },

  userInfo: { flex: 2, marginLeft: 12 },

  userName: { fontSize: 15, fontWeight: "bold", color: "#2A3A56" },

  userData: { fontSize: 11, color: "#2D9CDB" },

  roleContainer: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  verticalLine: {
    width: 1,
    height: 30,
    backgroundColor: "#00D2B1",
    marginHorizontal: 8,
  },

  roleText: { fontSize: 11, color: "#666" },

  userCode: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#2D9CDB",
    textAlign: "right",
  },

  btnNewUser: {
    backgroundColor: "#00D2B1",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 25,
    right: 25,
  },

  btnNewUserText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});