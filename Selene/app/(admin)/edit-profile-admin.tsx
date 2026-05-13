import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("user");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [notificacoes, setNotificacoes] = useState(true);
  const [salvarLogin, setSalvarLogin] = useState(true);
  const [idExibicao, setIdExibicao] = useState("00000000");
  const [iniciais, setIniciais] = useState("US");
  const isAdmin = role === "admin" || role === "superadmin";

  // Iniciar Role
  useEffect(() => {
    const init = async () => {
      const roleStorage = await SecureStore.getItemAsync("userRole");
      setRole(roleStorage || "user");
    };
    init();
  }, []);

  // Carregar Dados
  useEffect(() => {
    if (!role) return;

    const carregarDados = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const endpoint = isAdmin
          ? "https://selene-mobile.onrender.com/api/v1/admin/perfil"
          : "https://selene-mobile.onrender.com/api/v1/auth/perfil";

        if (token) {
          const res = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          if (res.ok && data.data) {
            const user = data.data;
            setNome(user.nome_completo || "");
            setEmail(user.email || "");
            setTelefone(user.telefone || "");

            if (user.nome_completo) {
              const partes = user.nome_completo.trim().split(/\s+/);
              setIniciais(
                partes.length > 1
                  ? (partes[0][0] + partes[1][0]).toUpperCase()
                  : partes[0][0].toUpperCase()
              );
            }
            if (user._id) setIdExibicao(user._id.substring(0, 8));
            setLoading(false);
            return;
          }
        }

        // Fallback local
        const nomeSalvo = await SecureStore.getItemAsync("userName");
        const emailSalvo = await SecureStore.getItemAsync("userEmail");
        const idSalvo = await SecureStore.getItemAsync("userId");

        if (nomeSalvo) {
          setNome(nomeSalvo);
          const partes = nomeSalvo.trim().split(/\s+/);
          setIniciais(
            partes.length > 1
              ? (partes[0][0] + partes[1][0]).toUpperCase()
              : partes[0][0].toUpperCase()
          );
        }
        if (emailSalvo) setEmail(emailSalvo);
        if (idSalvo) setIdExibicao(idSalvo.substring(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [role]);

  const handleSalvar = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const url = isAdmin
        ? "https://selene-mobile.onrender.com/api/v1/admin/perfil"
        : "https://selene-mobile.onrender.com/api/v1/auth/perfil";

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome_completo: nome,
          email: email,
          telefone: telefone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      await SecureStore.setItemAsync("userName", nome);

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.push("/(admin)/profile-admin");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado");
      }
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* HEADER */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Editar Perfil</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={() => router.push("/(admin)/profile-admin")}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CONTEÚDO */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source="https://i.pravatar.cc/300"
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{nome}</Text>
          <Text style={styles.userId}>ID: {idExibicao}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingBottom: 150 }}>
              <Text style={styles.sectionTitle}>Configurações Usuário</Text>

              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
              />

              <Text style={styles.label}>Telefone:</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
              />

              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={[styles.input, !isAdmin && { opacity: 0.6 }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={isAdmin}
              />

              <View style={styles.switchRow}>
                <Text style={styles.label}>Ativar Notificações</Text>
                <Switch
                  value={notificacoes}
                  onValueChange={setNotificacoes}
                  trackColor={{ false: "#767577", true: "#00D1A0" }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.label}>Salvar Login</Text>
                <Switch
                  value={salvarLogin}
                  onValueChange={setSalvarLogin}
                  trackColor={{ false: "#767577", true: "#00D1A0" }}
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
                <Text style={styles.saveBtnText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// -------------------
// Main Container & Layout
// -------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#95C159"
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  // -------------------
  // Header Section
  // -------------------

  topContainer: {
    backgroundColor: "#95C159",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 60,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56"
  },
  subwelcomeText: {
    fontSize: 14,
    color: "#2A3A56",
    opacity: 0.8
  },

  // -------------------
  // Profile / Avatar Components
  // -------------------

  imageContainer: {
    position: "absolute",
    top: -60,
    alignSelf: "center",
    backgroundColor: "#FFF",
    padding: 5,
    borderRadius: 65,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  cameraBtn: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#00D1A0",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
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
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3A56"
  },

  // -------------------
  // User Info & Typography
  // -------------------

  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
    textAlign: "center",
  },
  userId: {
    fontSize: 14,
    color: "#2A3A56",
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "600",
  },

  // -------------------
  // Form & Inputs
  // -------------------

  form: {
    paddingHorizontal: 25,
    marginBottom: 120,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#2A3A56",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  // -------------------
  // Action Buttons
  // -------------------

  saveBtn: {
    backgroundColor: "#00D1A0",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  saveBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16
  },
});