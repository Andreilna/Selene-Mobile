import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

/* =======================
    TYPES & MOCK DATA
======================= */
type Atualizacao = {
  id: string;
  titulo: string;
  data: string;
  status: "Realizado" | "Em andamento";
};

const DATA: Atualizacao[] = [
  {
    id: "1",
    titulo: "Novos Filtros Produtor",
    data: "01 Maio - 15:00",
    status: "Realizado",
  },
  {
    id: "2",
    titulo: "Novo Padrão IOT",
    data: "01 Maio - 15:00",
    status: "Realizado",
  },
  {
    id: "3",
    titulo: "Melhoria Busca Estufa",
    data: "01 Maio - 15:00",
    status: "Realizado",
  },
  {
    id: "4",
    titulo: "Novo Campo Para Estufas",
    data: "01 Maio - 15:00",
    status: "Realizado",
  },
];

export default function MenuAtualizacoes() {
  const [tab, setTab] = useState<"Realizadas" | "Andamento">("Realizadas");
  const [iniciais, setIniciais] = useState("US");

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
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
      } catch (e) {}
    };
    carregarDadosUsuario();
  }, []);

  const renderItem = ({ item }: { item: Atualizacao }) => (
    <View style={styles.itemCard}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name="tools" size={24} color="#FFF" />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.itemTitle}>{item.titulo}</Text>
        <Text style={styles.itemDate}>{item.data}</Text>
      </View>

      <Text style={styles.statusText}>{item.status}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* HEADER VERDE */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/(admin)/home-admin")}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Menu Atualizações</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CONTEÚDO BRANCO */}
        <View style={styles.content}>
          {/* TOGGLE TABS */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                tab === "Realizadas" && styles.tabActive,
              ]}
              onPress={() => setTab("Realizadas")}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === "Realizadas" && styles.tabTextActive,
                ]}
              >
                Realizadas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                tab === "Andamento" && styles.tabActive,
              ]}
              onPress={() => setTab("Andamento")}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === "Andamento" && styles.tabTextActive,
                ]}
              >
                Em andamento
              </Text>
            </TouchableOpacity>
          </View>

          {/* LISTA */}
          <View style={styles.listHeader}>
            <Text style={styles.monthText}>Maio</Text>
            <TouchableOpacity style={styles.calendarIcon}>
              <MaterialCommunityIcons
                name="calendar-month"
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>

          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
    marginTop: 14,
  },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  subwelcomeText: { fontSize: 14, color: "#2A3A56", opacity: 0.8 },
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

  /* TABS */
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    padding: 5,
    marginBottom: 25,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "#00D191", // Cor verde vibrante do botão selecionado
  },
  tabText: { color: "#2A3A56", fontWeight: "500" },
  tabTextActive: { color: "#FFF", fontWeight: "bold" },

  /* LISTAGEM */
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: { fontSize: 16, fontWeight: "bold", color: "#2A3A56" },
  calendarIcon: {
    backgroundColor: "#00D191",
    padding: 6,
    borderRadius: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#00D191",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: { fontSize: 15, fontWeight: "bold", color: "#2A3A56" },
  itemDate: { fontSize: 12, color: "#007BFF", marginTop: 2 },
  statusText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
});
