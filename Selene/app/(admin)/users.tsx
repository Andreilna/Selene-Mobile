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

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [admins, setAdmins] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [iniciais, setIniciais] = useState("US");
  const [filterActive, setFilterActive] = useState("Dia");

  const formatDate = (dateString: any) => {
    if (!dateString) return "Agora";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ================= USER HEADER =================
  useEffect(() => {
    const loadUser = async () => {
      const nome = await SecureStore.getItemAsync("userName");

      if (nome) {
        const parts = nome.split(" ");
        const init =
          parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();

        setIniciais(init);
      }
    };

    loadUser();
  }, []);

  // ================= TOKEN =================
  useEffect(() => {
    const loadToken = async () => {
      const t = await SecureStore.getItemAsync("userToken");
      setToken(t);
    };

    loadToken();
  }, []);

  // ================= NORMALIZER =================
  const normalizeList = (res: any) => {
    const data = res?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.usuarios)) return data.usuarios;
    if (Array.isArray(data?.admins)) return data.admins;

    return [];
  };

  // ================= FETCH =================
  const fetchDados = async () => {
    try {
      setLoading(true);

      const [resUsers, resAdmins] = await Promise.all([
        fetch("https://selene-mobile.onrender.com/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("https://selene-mobile.onrender.com/api/v1/admin/listar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const usersData = await resUsers.json();
      const adminsData = await resAdmins.json();

      // ================= USERS =================
      const usersList = normalizeList(usersData);

      const usersFormatted = usersList.map((u: any, index: number) => {
        const nome =
          u.nome_completo || u.nome || u.usuario || u.email?.split("@")[0];

        return {
          id: u._id || index.toString(),
          nome: nome || "Usuário",
          data: formatDate(u.criado_em),
          cargo: u.role || "user",
          codigo: (u._id || "").slice(-6),
        };
      });

      // ================= ADMINS =================
      const adminsList = normalizeList(adminsData);

      const adminsFormatted = adminsList.map((u: any, index: number) => {
        const nome = u.nome_completo || u.usuario || u.email?.split("@")[0];

        return {
          id: u._id || index.toString(),
          nome: nome || "Admin",
          data: formatDate(u.criado_em),
          cargo: u.nivel_acesso || "superadmin",
          codigo: (u._id || "").slice(-6),
        };
      });

      setUsuarios(usersFormatted);
      setAdmins(adminsFormatted);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    if (token) {
      fetchDados();
    }
  }, [token]);

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

            <Text style={styles.welcomeText}>Controle Acessos</Text>

            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStatCard}>
            <Text style={styles.statLabelLink}>Total de Acessos</Text>
            <Text style={styles.statValueBig}>
              {usuarios.length + admins.length}
            </Text>
          </View>

          <View style={styles.secondaryStatsRow}>
            <View style={styles.subStat}>
              <View style={styles.subStatLabelRow}>
                <Feather name="external-link" size={14} color="#2A3A56" />
                <Text style={styles.subStatLabel}>Usuários</Text>
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
          {/* FILTER */}
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

          {/* ADMINS */}
          <Text style={styles.sectionTitle}>Admins</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00D2B1" />
          ) : (
            <FlatList
              data={admins}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push("/(admin)/edit-profile-register")}>
                  <View style={styles.userCard}>
                    <View style={styles.userIconContainer}>
                      <Feather name="shield" size={24} color="#fff" />
                    </View>

                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{item.nome}</Text>
                      <Text style={styles.userData}>{item.data}</Text>
                    </View>

                    <Text style={styles.userCode}>{item.codigo}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* USERS */}
          <Text style={styles.sectionTitle}>Usuários</Text>

          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userIconContainer}>
                  <Feather name="user" size={24} color="#fff" />
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.nome}</Text>
                  <Text style={styles.userData}>{item.data}</Text>
                </View>

                <Text style={styles.userCode}>{item.codigo}</Text>
              </View>
            )}
          />
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
