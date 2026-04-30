import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export default function CadastroEstufa() {
  const router = useRouter();

  // ==========================================
  // ESTADOS (STATES)
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [camera, setCamera] = useState("");
  const [obs, setObs] = useState("");
  const [data] = useState(new Date().toLocaleDateString("pt-BR"));

  // ==========================================
  // LÓGICA DE CADASTRO
  // ==========================================
  const handleSalvar = async () => {
    // Validação básica
    if (!nome || !quantidade) {
      Alert.alert("Erro", "Por favor, preencha o nome e a quantidade.");
      return;
    }

    setLoading(true);

    try {
      // Recupera o token salvo no login para autenticar a requisição
      const token = await SecureStore.getItemAsync("userToken");

      const payload = {
        nome: nome,
        quantidade_compostos: quantidade,
        endereco_camera: camera,
        observacoes: obs,
        data_criacao: data,
        status: "Baixo", // Status inicial padrão para novas estufas
      };

      // Envio para o backend no Render
      const response = await axios.post(
        "https://selene-mobile.onrender.com/api/v1/estufas/cadastrar",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        Alert.alert("Sucesso ✅", "Estufa cadastrada com sucesso!");
        router.replace("/(tabs)/estufas");
      }
    } catch (error: any) {
      console.log("Erro ao cadastrar:", error.response?.data || error.message);
      const msg =
        error.response?.data?.message || "Não foi possível salvar a estufa.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* ---------------------------------------------------------
            HEADER (DARK THEME SOBRE VERDE)
        ---------------------------------------------------------- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#2A3A56" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Nova Estufa</Text>

          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>LB</Text>
            </View>
            <Feather
              name="bell"
              size={24}
              color="#2A3A56"
              style={{ marginLeft: 12 }}
            />
          </View>
        </View>

        {/* ---------------------------------------------------------
            FORMULÁRIO (CONTEÚDO BRANCO)
        ---------------------------------------------------------- */}
        <View style={styles.content}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* DATA DE CRIAÇÃO (SOMENTE LEITURA) */}
            <Text style={styles.label}>Data Criação</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={data} editable={false} />
              <TouchableOpacity style={styles.calendarIcon} disabled>
                <Feather name="calendar" size={18} color="white" />
              </TouchableOpacity>
            </View>

            {/* NOME DA ESTUFA */}
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Estufa Setor Norte"
              placeholderTextColor="#A0A0A0"
            />

            {/* QUANTIDADE DE COMPOSTOS */}
            <Text style={styles.label}>Quantidade Compostos</Text>
            <TextInput
              style={styles.input}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#A0A0A0"
            />

            {/* URL DA CÂMERA */}
            <Text style={styles.label}>Endereço Câmera (URL)</Text>
            <TextInput
              style={styles.input}
              value={camera}
              onChangeText={setCamera}
              placeholder="http://192.168.0.1"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="none"
            />

            {/* OBSERVAÇÕES (TEXTAREA) */}
            <Text style={[styles.label, { color: "#00D2B1" }]}>
              Observações
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={obs}
              onChangeText={setObs}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Notas adicionais..."
              placeholderTextColor="#A0A0A0"
            />

            {/* BOTÃO SALVAR */}
            <TouchableOpacity
              style={[styles.btnSalvar, loading && { opacity: 0.7 }]}
              onPress={handleSalvar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnSalvarText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 1,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2A3A56" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: { color: "#2A3A56", fontWeight: "bold", fontSize: 13 },

  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingTop: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 8,
    marginLeft: 5,
  },
  inputContainer: { position: "relative", justifyContent: "center" },

  input: {
    backgroundColor: "#E1F5E5",
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#2A3A56",
    fontSize: 15,
  },
  calendarIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    backgroundColor: "#00D2B1",
    borderRadius: 8,
    padding: 6,
  },
  textArea: { height: 120, paddingTop: 15, borderRadius: 25 },

  btnSalvar: {
    backgroundColor: "#95C159",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  btnSalvarText: { color: "#FFF", fontWeight: "bold", fontSize: 18 },
});
