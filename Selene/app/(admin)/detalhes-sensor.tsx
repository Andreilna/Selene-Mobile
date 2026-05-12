import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit"; // Instale: npx expo install react-native-chart-kit react-native-svg
import * as SecureStore from "expo-secure-store";

export default function DetalhesSensor() {
  const router = useRouter();
  const { id, nome, local } = useLocalSearchParams();
  const [iniciais, setIniciais] = useState("US");
  const [token, setToken] = useState<string | null>(null);
  const [leituras, setLeituras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
  };

  const buscarLeituras = async (sensorId: string, adminToken: string) => {
    try {
      console.log("BUSCANDO SENSOR:", sensorId);

      const response = await fetch(
        `https://selene-mobile.onrender.com/api/v1/dispositivos/${sensorId}/leituras`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("DADOS SENSOR:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao buscar leituras");
      }

      setLeituras(data);
    } catch (error) {
      console.log("ERRO LEITURAS:", error);

      Alert.alert("Erro", "Falha ao carregar leituras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [adminToken, adminName] = await Promise.all([
          SecureStore.getItemAsync("userToken"),
          SecureStore.getItemAsync("userName"),
        ]);

        // TOKEN INVÁLIDO
        if (!adminToken) {
          router.replace("/(auth)");
          return;
        }

        setToken(adminToken);

        // PEGA ID
        const sensorId = Array.isArray(id) ? id[0] : id;

        // BUSCA LEITURAS
        if (sensorId) {
          await buscarLeituras(sensorId, adminToken);
        }

        // INICIAIS
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

        Alert.alert("Erro", "Falha ao carregar dados do usuário.");
      }
    };

    bootstrap();
  }, []);

  const handleExcluir = () => {
    Alert.alert("Excluir Sensor", `Deseja realmente remover o ${nome}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            // PEGA O ID
            const sensorId = Array.isArray(id) ? id[0] : id;

            // VALIDA TOKEN
            if (!token) {
              Alert.alert("Erro", "Sessão expirada. Faça login novamente.");

              router.replace("/(auth)");
              return;
            }

            // REQUISIÇÃO DELETE
            const response = await fetch(
              `https://selene-mobile.onrender.com/api/v1/dispositivos/${sensorId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              },
            );

            // CONVERTE RESPOSTA
            const data = await response.json();

            // ERRO
            if (!response.ok) {
              throw new Error(data.erro || "Erro ao excluir dispositivo");
            }

            // SUCESSO
            Alert.alert("Sucesso", "Sensor removido com sucesso");

            // VOLTA PRA LISTA
            router.replace("/(admin)/monitoring");
          } catch (error: any) {
            console.log("ERRO AO EXCLUIR:", error);

            Alert.alert(
              "Erro",
              error.message || "Não foi possível excluir o sensor",
            );
          }
        },
      },
    ]);
  };

  const ultimaLeitura = leituras.find((l) => l.tipo_leitura === "SENSORES");

  const leiturasTemperatura = leituras
    .filter((l) => l.tipo_leitura === "SENSORES")
    .slice(0, 6)
    .reverse();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/monitoring")}
            >
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>{nome || "Sensor"}</Text>
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

        <View style={styles.content}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 150,
            }}
            showsVerticalScrollIndicator={false}
          >
            {loading && (
              <ActivityIndicator
                size="large"
                color="#2A3A56"
                style={{ marginBottom: 20 }}
              />
            )}
            <Text style={styles.panelTitle}>PAINEL DE CONTROLE</Text>

            {/* ALERTAS */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="activity" size={18} color="#2A3A56" />

                <Text style={styles.sectionTitle}>Dados do Sensor</Text>
              </View>

              <View style={styles.alertRow}>
                <Text style={styles.alertText}>
                  Temperatura: {ultimaLeitura?.dados?.temperatura ?? "--"} °C
                </Text>
              </View>

              <View style={styles.alertRow}>
                <Text style={styles.alertText}>
                  Umidade: {ultimaLeitura?.dados?.umidade ?? "--"} %
                </Text>
              </View>

              <View style={styles.alertRow}>
                <Text style={styles.alertText}>
                  Luminosidade: {ultimaLeitura?.dados?.luminosidade ?? "--"}
                </Text>
              </View>

              <View style={styles.alertRow}>
                <Text style={styles.alertText}>
                  Nível Água: {ultimaLeitura?.dados?.nivel_agua ?? "--"}
                </Text>
              </View>
            </View>

            {/* GRÁFICO (Histórico) */}
            {/* LEITURAS DA CÂMERA */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="camera"
                  size={18}
                  color="#2A3A56"
                />

                <Text style={styles.sectionTitle}>Capturas da Câmera</Text>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#2A3A56" />
              ) : leituras.length === 0 ? (
                <Text>Nenhuma captura encontrada</Text>
              ) : (
                leituras.slice(0, 5).map((item) => {
                  const imagem = `https://selene-mobile.onrender.com${item.dados?.foto_path}`;

                  return (
                    <View
                      key={item._id}
                      style={{
                        marginBottom: 15,
                        backgroundColor: "#FFF",
                        borderRadius: 15,
                        padding: 10,
                      }}
                    >
                      <Image
                        source={{ uri: imagem }}
                        style={{
                          width: "100%",
                          height: 220,
                          borderRadius: 15,
                        }}
                        resizeMode="cover"
                      />

                      <Text
                        style={{
                          marginTop: 8,
                          color: "#2A3A56",
                          fontSize: 12,
                        }}
                      >
                        {new Date(item.timestamp).toLocaleString("pt-BR")}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>

            {/* PROGRESSO */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Feather name="clock" size={18} color="#2A3A56" />

                <Text style={styles.sectionTitle}>Última Atualização</Text>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "100%" }]}>
                  <Text style={styles.progressText}>
                    {ultimaLeitura?.timestamp
                      ? new Date(ultimaLeitura.timestamp).toLocaleString(
                          "pt-BR",
                        )
                      : "--"}
                  </Text>
                </View>
              </View>
            </View>

            {/* BOTÃO EXCLUIR */}
            <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluir}>
              <Feather name="trash-2" size={20} color="#FFF" />
              <Text style={styles.deleteBtnText}>Excluir Sensor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#95C159",
  },

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

  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  subwelcomeText: {
    fontSize: 14,
    color: "#2A3A56",
    opacity: 0.8,
  },

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
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  textContainer: {
    flex: 1,
    marginLeft: 20,
  },

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
    paddingTop: 30,
  },

  scrollContent: { paddingBottom: 40 },
  whitePanel: {
    flex: 1,
    backgroundColor: "#FFF",
    marginTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2A3A56",
    marginBottom: 20,
    letterSpacing: 1,
  },
  sectionCard: {
    backgroundColor: "#E8F9EE",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#2A3A56" },
  alertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  alertText: { fontSize: 12, color: "#2A3A56", flex: 1 },
  alertTime: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2A3A56",
    marginLeft: 10,
  },
  progressBarBg: {
    height: 35,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#45E3B8",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  deleteBtn: {
    flexDirection: "row",
    backgroundColor: "#FF6666",
    height: 55,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  deleteBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  indicatorsList: {
    maxHeight: 50,
    marginBottom: 25,
  },
});
