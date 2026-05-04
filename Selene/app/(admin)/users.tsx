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
    if (!dateString) return "Abril 30 - 14:40";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
    }) + " - " + date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= USER HEADER =================
  useEffect(() => {
    const loadUser = async () => {
      const nome = await SecureStore.getItemAsync("userName");
      if (nome) {
        const parts = nome.split(" ");
        const init = parts.length > 1
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
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://selene-mobile.onrender.com/api/v1/admin/listar", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await resUsers.json();
      const adminsData = await resAdmins.json();

      const usersFormatted = normalizeList(usersData).map((u: any, index: number) => ({
        id: u._id || index.toString(),
        nome: u.nome_completo || u.nome || "Usuário",
        data: formatDate(u.criado_em),
        cargo: "Produtor",
        codigo: (u._id || "000000").slice(-7),
      }));

      const adminsFormatted = normalizeList(adminsData).map((u: any, index: number) => ({
        id: u._id || index.toString(),
        nome: u.nome_completo || u.usuario || "Admin",
        data: formatDate(u.criado_em),
        cargo: "Admin",
        codigo: (u._id || "000000").slice(-7),
      }));

      setUsuarios(usersFormatted);
      setAdmins(adminsFormatted);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDados();
  }, [token]);

  const timeFilters = ["Dia", "Semana", "Mês", "Ano"];

  // CORREÇÃO: Função definida FORA do return
  const renderUserItem = (item: Usuario) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(admin)/edit-profile-register",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.userCard}>
        <View style={styles.userIconContainer}>
          <Feather name="user" size={24} color="#fff" />
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.welcomeText}>Controle Acessos</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.mainStatCard}>
            <Text style={styles.statLabelLink}>Usuários Cadastrados</Text>
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
              <Text style={[styles.subStatValue, { color: "#2D9CDB" }]}>--</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtores Cadastrados</Text>
            <TouchableOpacity style={styles.filterIconBtn}>
              <MaterialIcons name="filter-list" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* CORREÇÃO: Lista reativada com ActivityIndicator */}
          {loading ? (
            <ActivityIndicator size="large" color="#00D2B1" />
          ) : (
            <FlatList
              data={[...admins, ...usuarios]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderUserItem(item)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )}

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },
  topContainer: { paddingBottom: 20, paddingTop: 10, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "bold", color: "#2A3A56" },
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
  subStat: { flex: 1, alignItems: "flex-start" },
  subStatLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  subStatLabel: { fontSize: 13, color: "#2A3A56", marginLeft: 5 },
  subStatValue: { fontSize: 28, fontWeight: "bold", color: "#FFF" },
  verticalDivider: {
    width: 1.5,
    height: 40,
    backgroundColor: "#FFF",
    opacity: 0.6,
    marginHorizontal: 15,
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
    borderRadius: 25,
    padding: 5,
    marginBottom: 25,
  },
  timeBtn: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 20 },
  timeBtnActive: { backgroundColor: "#00D2B1" },
  timeBtnText: { color: "#2A3A56", fontSize: 14 },
  timeBtnTextActive: { color: "#FFF", fontWeight: "bold" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1A2E35" },
  filterIconBtn: { backgroundColor: "#00D2B1", padding: 8, borderRadius: 12 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  userIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00D2B1",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: { flex: 1.5, marginLeft: 12 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#1A2E35" },
  userData: { fontSize: 12, color: "#2D9CDB", fontWeight: "bold" },

  roleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalLine: {
    width: 1.5,
    height: 35,
    backgroundColor: "#00D2B1",
    opacity: 0.4,
    marginHorizontal: 12,
  },
  roleText: { fontSize: 12, color: "#666" },

  userCode: {
    flex: 1,
    fontSize: 15,
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
    left: 80,
    right: 80,
  },
  btnNewUserText: { color: "#1A2E35", fontWeight: "bold", fontSize: 16 },
});