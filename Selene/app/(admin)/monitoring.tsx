import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import { router } from "expo-router";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import * as SecureStore from "expo-secure-store";

type Sensor = {
  id: string;
  nome: string;
  local: string;
  tipo: string;
  status: "Ativo" | "Inativo";
};

export default function MonitoramentoAdmin() {
  const [iniciais, setIniciais] = useState("AD");
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
  };

  // ==========================================
  // BOOTSTRAP
  // ==========================================
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [adminToken, adminName] = await Promise.all([
          SecureStore.getItemAsync("adminToken"),
          SecureStore.getItemAsync("adminName"),
        ]);

        setToken(adminToken);

        if (adminName) {
          const partes = adminName.trim().split(" ");

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

    bootstrap();
  }, []);

  // ==========================================
  // FETCH SENSORES
  // ==========================================
  const fetchSensores = async (isRefresh = false) => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(
        "https://selene-mobile.onrender.com/api/v1/dispositivos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const json = await res.json();

      if (!res.ok) {
        Alert.alert("Erro", json?.message || "Erro ao buscar sensores");
        return;
      }

      const listaReais = json?.data || [];

      const formatados = listaReais.map((d: any) => ({
        id: d._id || String(Math.random()),

        nome: d.nome || d.nome_dispositivo || "Dispositivo sem nome",

        local: d.localizacao || d.local || "Área Externa",

        tipo: d.tipo || "Tipo não especificado",

        status: d.ativo === true || d.status === "online" ? "Ativo" : "Inativo",
      }));

      setSensores(formatados);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // AUTO FETCH
  // ==========================================
  useEffect(() => {
    if (token) {
      fetchSensores();
    }
  }, [token]);

  // ==========================================
  // COMPONENTE INDICADOR
  // ==========================================
  const Indicator = ({ icon, value, unit }: any) => (
    <View style={styles.indicatorCard}>
      <MaterialCommunityIcons name={icon} size={18} color="#2A3A56" />

      <Text style={styles.indicatorText}>
        {value}
        {unit}
      </Text>
    </View>
  );

  // ==========================================
  // RENDER SENSOR
  // ==========================================
  const renderSensor = ({ item }: { item: Sensor }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(admin)/detalhes-sensor",
          params: {
            id: item.id,
            nome: item.nome,
            local: item.local,
          },
        })
      }
    >
      <View style={styles.sensorCard}>
        <View style={styles.sensorIconContainer}>
          <MaterialCommunityIcons name="molecule" size={32} color="#2A3A56" />

          <View style={styles.sensorPlantsIcon}>
            <FontAwesome5 name="leaf" size={12} color="#2A3A56" />

            <FontAwesome5 name="leaf" size={12} color="#2A3A56" />
          </View>
        </View>

        <View style={styles.sensorInfo}>
          <Text style={styles.sensorTitle}>{item.nome}</Text>

          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color="#777" />

            <Text style={styles.locationText}>{item.local}</Text>
          </View>

          <View style={styles.locationRow}>
            <Feather name="cpu" size={12} color="#777" />

            <Text style={styles.locationText}>{item.tipo}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.status === "Ativo" ? "#66FF66" : "#FF6666",
              },
            ]}
          />

          <Text style={styles.statusLabel}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/home-admin")}
            >
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Monitoramento</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 8,
                }}
              >
                {/* BOTÃO REFRESH */}
                <TouchableOpacity onPress={() => fetchSensores(true)}>
                  <Feather name="refresh-cw" size={22} color="#2A3A56" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.indicatorsList}
            contentContainerStyle={{
              gap: 10,
              paddingRight: 20,
            }}
          >
            <Indicator icon="thermometer" value="24" unit="°C" />
            <Indicator icon="sun-wireless" value="16" unit="%" />
            <Indicator icon="cloud-outline" value="10" unit="%" />
            <Indicator icon="water-percent" value="60" unit="%" />
          </ScrollView>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#95C159"
              style={{ marginTop: 40 }}
            />
          ) : (
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              data={sensores}
              keyExtractor={(item) => item.id}
              renderItem={renderSensor}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchSensores(true)}
                />
              }
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 30,
                    color: "#999",
                  }}
                >
                  Nenhum sensor cadastrado.
                </Text>
              }
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => router.push("/(admin)/sensors")}
                >
                  <Feather name="plus" size={20} color="#2A3A56" />
                  <Text style={styles.addBtnText}>Novo Sensor</Text>
                </TouchableOpacity>
              }
            />
          )}
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

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  indicatorsList: {
    maxHeight: 50,
    marginBottom: 25,
  },

  indicatorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#45E3B8",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },

  indicatorText: {
    color: "#2A3A56",
    fontWeight: "bold",
    fontSize: 14,
  },

  sensorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F9EE",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },

  sensorIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  sensorPlantsIcon: {
    flexDirection: "row",
    gap: 5,
    marginTop: -5,
  },

  sensorInfo: {
    flex: 1,
    marginLeft: 15,
  },

  sensorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  locationText: {
    fontSize: 13,
    color: "#777",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  statusLabel: {
    fontSize: 13,
    color: "#2A3A56",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
  },

  addBtnText: {
    marginLeft: 8,
    color: "#2A3A56",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 120,
  },
});
