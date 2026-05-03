import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function NovoUsuario() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nivel, setNivel] = useState("user");
  const [iniciais, setIniciais] = useState("US");
  const [loading, setLoading] = useState(false);

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

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
  };

  // ================= CREATE USER =================
  const handleSubmit = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha os campos obrigatórios");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Erro", "Senha precisa ter no mínimo 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("userToken");

      // 🔥 DECIDE O ENDPOINT AQUI
      const endpoint =
        nivel === "admin"
          ? "https://selene-mobile.onrender.com/api/v1/admin/criar"
          : "https://selene-mobile.onrender.com/api/v1/users";

      const body =
        nivel === "admin"
          ? {
              usuario: email.split("@")[0], // ou cria um campo usuário separado se quiser
              nome_completo: nome.trim(),
              email: email.toLowerCase().trim(),
              senha,
              telefone: telefone || "",
              nivel_acesso: "admin",
            }
          : {
              nome_completo: nome.trim(),
              email: email.toLowerCase().trim(),
              senha,
              telefone: telefone || null,
              data_nascimento: dataNascimento || null,
              tipo: "user",
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao criar usuário");
      }

      Alert.alert(
        "Sucesso",
        nivel === "admin"
          ? "Administrador criado com sucesso!"
          : "Usuário criado com sucesso!",
      );

      router.back();
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={28} color="#2A3A56" />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Novo Cadastro</Text>
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.avatarCircle}
                onPress={handleGoProfile}
              >
                <Text style={styles.avatarText}>{iniciais}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/alert")}>
                <Feather name="bell" size={24} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FORM */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <Text style={styles.label}>Data Nascimento</Text>
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="DD/MM/AAAA"
          />

          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(13) 99999-9999"
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha *</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {/* FOTO (placeholder visual) */}
          <View style={styles.photoBox}>
            <Feather name="user" size={40} color="#fff" />
            <View style={styles.cameraIcon}>
              <Feather name="camera" size={14} color="#fff" />
            </View>
          </View>

          {/* NIVEL */}
          <Text style={styles.label}>Nível de Acesso</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.radio, nivel === "user" && styles.radioActive]}
              onPress={() => setNivel("user")}
            >
              <Text>Produtor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.radio, nivel === "admin" && styles.radioActive]}
              onPress={() => setNivel("admin")}
            >
              <Text>Administrador</Text>
            </TouchableOpacity>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Criando..." : "Cadastrar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ================= STYLES =================
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
  },

  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  textContainer: { flex: 1, marginLeft: 20 },

  content: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 50,
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
    color: "#2A3A56",
  },

  input: {
    backgroundColor: "#E9F9EA",
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
  },

  photoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00D2B1",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2A3A56",
    borderRadius: 10,
    padding: 3,
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  radio: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#95C159",
    borderRadius: 10,
    alignItems: "center",
  },

  radioActive: {
    backgroundColor: "#95C159",
  },

  btn: {
    backgroundColor: "#00D2B1",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
