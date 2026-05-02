import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

export default function AdminUsers() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("user"); // user ou admin
  const [loading, setLoading] = useState(false);
  const [iniciais, setIniciais] = useState("US");
  const router = useRouter();

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

  const handleCreateUser = () => {
    if (!nome || !email)
      return Alert.alert("Erro", "Preencha os campos básicos.");
    setLoading(true);
    // Aqui vai seu fetch para a API
    setTimeout(() => {
      Alert.alert("Sucesso", "Usuário cadastrado!");
      setLoading(false);
    }, 1500);
  };

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
            <View>
              <Text style={styles.welcomeText}>Cadastrar</Text>

            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => router.push("/profile")}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/alert")}>
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
        <ScrollView style={styles.content}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: João Silva"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => setEmail(t.toLowerCase())}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Nível de Acesso</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.chip, cargo === "user" && styles.chipActive]}
              onPress={() => setCargo("user")}
            >
              <Text
                style={
                  cargo === "user" ? styles.chipTextActive : styles.chipText
                }
              >
                Usuário
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, cargo === "admin" && styles.chipActive]}
              onPress={() => setCargo("admin")}
            >
              <Text
                style={
                  cargo === "admin" ? styles.chipTextActive : styles.chipText
                }
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCreateUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Perfil</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

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
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FBF8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  row: { flexDirection: "row", gap: 10, marginBottom: 30 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2A3A56",
  },
  chipActive: { backgroundColor: "#2A3A56" },
  chipText: { color: "#2A3A56", fontWeight: "bold" },
  chipTextActive: { color: "#FFF", fontWeight: "bold" },
  button: {
    backgroundColor: "#95C159",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#2A3A56", fontWeight: "bold", fontSize: 16 },
});
