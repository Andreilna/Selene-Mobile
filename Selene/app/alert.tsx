import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function AlertasScreen() {
  const router = useRouter();
  const [iniciais, setIniciais] = useState("US");

  const handleGoProfile = async () => {
    const role = await SecureStore.getItemAsync("userRole");

    const isAdmin = role === "admin" || role === "superadmin";

    router.push(isAdmin ? "/(admin)/profile-admin" : "/(tabs)/profile");
  };

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
              <Text style={styles.welcomeText}>Alertas</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity>
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
            CONTEÚDO PRINCIPAL (BRANCO)
        ---------------------------------------------------------- */}
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {/* FILTROS DE PRIORIDADE (TABS) */}
            <View style={styles.filterContainer}>
              <TouchableOpacity style={[styles.filterTab, styles.filterActive]}>
                <Text style={styles.filterTextActive}>Total(2)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Text style={styles.filterText}>Alta(1)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Text style={styles.filterText}>Média(2)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}>
                <Text style={styles.filterText}>Baixo(0)</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE CARDS DE ALERTA */}
            <AlertaCard
              titulo="Risco elevado detectado"
              sub="Detecção de possível contaminação por fungo invasor"
              estufa="Estufa 2"
              tempo="há 15 minutos"
              prioridade="Alta"
              corPrioridade="#E74C3C"
            />

            <AlertaCard
              titulo="Umidade acima do ideal"
              sub="Umidade está 5% acima do recomendado"
              estufa="Estufa 3"
              tempo="há cerca de 1 hora"
              prioridade="Média"
              corPrioridade="#95A5A6"
            />

            {/* SEÇÃO DE ANÁLISES VISUAIS */}
            <Text style={styles.sectionTitle}>Últimas Análises</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.analiseScroll}
            >
              <AnaliseCard
                img="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400"
                data="05 de outubro, 15:25"
                local="Estufa 2 - Setor B"
              />
              <AnaliseCard
                img="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400"
                data="05 de outubro, 12:15"
                local="Estufa 5 - Setor A"
              />
            </ScrollView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================================
// SUB-COMPONENTES (ORGANIZAÇÃO INTERNA)
// ==========================================================

function AlertaCard({
  titulo,
  sub,
  estufa,
  tempo,
  prioridade,
  corPrioridade,
}: any) {
  return (
    <View style={styles.alertaCard}>
      <View style={styles.alertaHeader}>
        <View style={styles.alertaIconBg}>
          <MaterialIcons name="cancel" size={20} color="#E74C3C" />
        </View>
        <Text style={styles.alertaTitle}>{titulo}</Text>
        <View style={[styles.badge, { backgroundColor: corPrioridade }]}>
          <Text style={styles.badgeText}>{prioridade}</Text>
        </View>
      </View>
      <Text style={styles.alertaSub}>{sub}</Text>
      <Text style={styles.alertaFooter}>
        {estufa} {tempo}
      </Text>
    </View>
  );
}

function AnaliseCard({ img, data, local }: any) {
  return (
    <View style={styles.analiseCard}>
      <Image source={{ uri: img }} style={styles.analiseImg} />
      <View style={styles.analiseInfo}>
        <Text style={styles.analiseText}>
          <Feather name="calendar" size={10} /> {data}
        </Text>
        <Text style={styles.analiseText}>
          <Feather name="map-pin" size={10} /> {local}
        </Text>
      </View>
    </View>
  );
}

// ==========================================================
// ESTILIZAÇÃO (STYLES)
// ==========================================================
const styles = StyleSheet.create({
  // ==========================================
  // ESTRUTURA PRINCIPAL
  // ==========================================
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
    marginBottom: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
    textAlign: "left",
  },
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

  textContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },

  // Content (Fundo Branco Arredondado)
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  // Filtros / Tabs
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 15,
    padding: 5,
    marginBottom: 25,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  filterActive: { backgroundColor: "#2A3A56" },
  filterTextActive: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  filterText: { color: "#666", fontSize: 11 },

  // Alerta Cards
  alertaCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  alertaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  alertaIconBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FDEDEC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  alertaTitle: { flex: 1, fontSize: 15, fontWeight: "bold", color: "#2A3A56" },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  alertaSub: { fontSize: 13, color: "#666", marginLeft: 40, marginBottom: 10 },
  alertaFooter: { fontSize: 11, color: "#AAA", marginLeft: 40 },

  // Seção de Análises
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A3A56",
    marginVertical: 15,
  },
  analiseScroll: { flexDirection: "row" },
  analiseCard: {
    width: 220,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3,
    marginBottom: 20,
  },
  analiseImg: { width: "100%", height: 140 },
  analiseInfo: { padding: 10 },
  analiseText: { fontSize: 10, color: "#666", marginBottom: 3 },
});
