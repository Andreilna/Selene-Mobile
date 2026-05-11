import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit"; // Instale: npx expo install react-native-chart-kit react-native-svg

export default function DetalhesSensor() {
  const router = useRouter();
  const { id, nome, local } = useLocalSearchParams();

  const handleExcluir = () => {
    Alert.alert("Excluir Sensor", `Deseja realmente remover o ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Excluir", 
        style: "destructive", 
        onPress: () => {
          // Aqui iria sua chamada de API: await fetch(URL/id, {method: 'DELETE'})
          Alert.alert("Sucesso", "Sensor removido.");
          router.push("/(admin)/monitoring");
        } 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(admin)/monitoring")}>
          <Feather name="arrow-left" size={28} color="#2A3A56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{nome || "Sensor"}</Text>
        <View style={styles.avatarCircle}><Text style={styles.avatarText}>RE</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.whitePanel}>
          <Text style={styles.panelTitle}>PAINEL DE CONTROLE</Text>

          {/* ALERTAS */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="alert-triangle" size={18} color="#2A3A56" />
              <Text style={styles.sectionTitle}>Alertas</Text>
            </View>
            <View style={styles.alertRow}>
              <Text style={styles.alertText}>Composto X1 Escaneado por completo</Text>
              <Text style={styles.alertTime}>18:25</Text>
            </View>
            <View style={styles.alertRow}>
              <Text style={styles.alertText}>Novo alerta de pragas Composto V1</Text>
              <Text style={styles.alertTime}>14:53</Text>
            </View>
          </View>

          {/* GRÁFICO (Histórico) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-line" size={18} color="#2A3A56" />
              <Text style={styles.sectionTitle}>Histórico de Alterações</Text>
            </View>
            <LineChart
              data={{
                labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                datasets: [{ data: [35, 45, 30, 50, 40, 48] }]
              }}
              width={Dimensions.get("window").width - 80}
              height={180}
              chartConfig={{
                backgroundColor: "#E8F9EE",
                backgroundGradientFrom: "#E8F9EE",
                backgroundGradientTo: "#E8F9EE",
                color: (opacity = 1) => `rgba(42, 58, 86, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#45E3B8" }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>

          {/* PROGRESSO */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Feather name="flag" size={18} color="#2A3A56" />
              <Text style={styles.sectionTitle}>Progresso Análises #13</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "68%" }]}>
                <Text style={styles.progressText}>68 %</Text>
              </View>
            </View>
          </View>

          {/* BOTÃO EXCLUIR */}
          <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluir}>
            <Feather name="trash-2" size={20} color="#FFF" />
            <Text style={styles.deleteBtnText}>Excluir Sensor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  avatarCircle: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#EDFCED", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 12, fontWeight: "bold", color: "#2A3A56" },
  scrollContent: { paddingBottom: 40 },
  whitePanel: { 
    flex: 1, 
    backgroundColor: "#FFF", 
    marginTop: 20, 
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50, 
    paddingHorizontal: 25, 
    paddingTop: 30 
  },
  panelTitle: { fontSize: 18, fontWeight: "900", color: "#2A3A56", marginBottom: 20, letterSpacing: 1 },
  sectionCard: { backgroundColor: "#E8F9EE", borderRadius: 20, padding: 15, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "bold", color: "#2A3A56" },
  alertRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF", padding: 10, borderRadius: 10, marginBottom: 8 },
  alertText: { fontSize: 12, color: "#2A3A56", flex: 1 },
  alertTime: { fontSize: 12, fontWeight: "bold", color: "#2A3A56", marginLeft: 10 },
  progressBarBg: { height: 35, backgroundColor: "#F0F0F0", borderRadius: 10, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#45E3B8", justifyContent: "center", alignItems: "center" },
  progressText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  deleteBtn: { 
    flexDirection: "row", 
    backgroundColor: "#FF6666", 
    height: 55, 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 10,
    gap: 10
  },
  deleteBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 }
});