import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

// ==========================================
// DADOS MOCKADOS (EXEMPLOS DE RELATÓRIOS)
// ==========================================
const DATA = [
  {
    id: "1",
    title: "Relatório #2 Exportado!",
    subtitle: "Análise de fungos parasitas em compostos de shimeji.",
    date: "24 Abril - 17:00",
    type: "bell",
  },
  {
    id: "2",
    title: "Relatório #3 Exportado!",
    subtitle: "Monitoramento cogumelo shimeji deformado.",
    date: "24 Abril - 17:00",
    type: "bell",
  },
  {
    id: "3",
    title: "Relatório #2 Alterado!",
    subtitle: "Alteração no campo descrição.",
    date: "24 Abril - 17:00",
    type: "edit",
  },
];

export default function RelatoriosScreen() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [iniciais, setIniciais] = useState("US");
  const [loading, setLoading] = useState(true);

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
      } catch (e) {
        console.log(e);
      }
    };

    carregarDadosUsuario();
  }, []);

  // ==========================================
  // RENDERIZAÇÃO DOS ITENS DA LISTA (CARDS)
  // ==========================================
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* ÍCONE DINÂMICO BASEADO NO TIPO */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: item.type === "bell" ? "#00D2B1" : "#00D2B1" },
        ]}
      >
        <Feather
          name={item.type === "bell" ? "bell" : "trending-down"}
          size={20}
          color="white"
        />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* ---------------------------------------------------------
            INÍCIO DO HEADER (VERDE SELENE)
        ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Relatórios</Text>
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
            CORPO DA PÁGINA (LISTAGEM BRANCA)
        ---------------------------------------------------------- */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Hoje</Text>

          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
        {/* ---------------------------------------------------------
            FIM DO CORPO
        ---------------------------------------------------------- */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  // Estrutura Principal
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
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },

  // Estilo do Item/Card
  card: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  textContainer: { flex: 1, marginLeft: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontSize: 16, fontWeight: "bold", color: "#2A3A56" },
  itemSubtitle: { fontSize: 13, color: "#666", marginTop: 4, lineHeight: 18 },
  itemDate: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 10,
    textAlign: "right",
  },

  // Separador de Itens
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
    marginLeft: 55,
  },
});
