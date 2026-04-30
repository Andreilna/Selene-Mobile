import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const router = useRouter();

  // ==========================================
  // ESTADOS (STATES)
  // ==========================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // LÓGICA DE AUTENTICAÇÃO (LOGIN)
  // ==========================================
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      let response;
      let isLoggedAsAdmin = false;

      // --- 1ª TENTATIVA: Login como Administrador ---
      try {
        const adminData = {
          usuario: email.trim().toLowerCase(),
          senha: password,
        };

        console.log("Tentando login como Admin...");
        response = await axios.post(
          "https://selene-mobile.onrender.com/api/v1/admin/login",
          adminData,
        );
        isLoggedAsAdmin = true;
      } catch (adminError: any) {
        const status = adminError.response?.status;

        // Se o admin não existir ou senha errada, tenta como usuário comum
        if (status === 401 || status === 404 || status === 400) {
          console.log("Admin não encontrado, tentando Usuário...");

          // --- 2ª TENTATIVA: Login como Usuário Comum ---
          const userData = {
            email: email.trim().toLowerCase(),
            senha: password,
          };

          response = await axios.post(
            "https://selene-mobile.onrender.com/api/v1/auth/login",
            userData,
          );
          isLoggedAsAdmin = false;
        } else {
          throw adminError; // Erro de conexão ou servidor (500)
        }
      }

      // --- SUCESSO: PERSISTÊNCIA DE DADOS ---
      if (response && response.data) {
        const { data } = response.data;
        const token = data?.token;
        const userDetails = isLoggedAsAdmin ? data?.admin : data?.usuario;

        if (!token || !userDetails) {
          throw new Error("Estrutura de resposta inválida.");
        }

        // Salvando no SecureStore (Drey, isso garante a sessão após fechar o app)
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync(
          "userName",
          userDetails.nome_completo || userDetails.usuario || "Usuário",
        );
        await SecureStore.setItemAsync("userEmail", userDetails.email || "");
        await SecureStore.setItemAsync("userId", userDetails._id);

        const role = isLoggedAsAdmin
          ? userDetails.nivel_acesso || "admin"
          : "user";
        await SecureStore.setItemAsync("userRole", role);

        console.log(`Logado com sucesso: ${role}`);

        // REDIRECIONAMENTO INTELIGENTE
        if (isLoggedAsAdmin) {
          // Se for admin, manda para a tela de admin (certifique-se de que o path existe)
          router.replace("/(admin)/home-admin");
        } else {
          // Se for usuário comum, mantém a rota atual
          router.replace("/(tabs)/home");
        }
      }
    } catch (error: any) {
      console.log("Erro no login:", error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message || "E-mail ou senha incorretos.";
      Alert.alert("Ops!", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---------------------------------------------------------
            TOPO: LOGOTIPO (FUNDO CLARO)
        ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          <Image
            source={require("../../assets/images/logo_selene_login.svg")}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* ---------------------------------------------------------
            FORMULÁRIO (FUNDO VERDE ARREDONDADO)
        ---------------------------------------------------------- */}
        <View style={styles.bottomContainer}>
          {/* CAMPO: EMAIL/USUÁRIO */}
          <Text style={styles.label}>Email / Usuário:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite seu acesso"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* CAMPO: SENHA */}
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              value={password}
              autoCapitalize="none"
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#2A3A56"
              />
            </TouchableOpacity>
          </View>

          {/* BOTÃO ENTRAR */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* LINKS ADICIONAIS */}
          <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
            <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {/* SOCIAL LOGIN */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Acessar com:</Text>
            <View style={styles.socialIconsRow}>
              <TouchableOpacity style={styles.socialIconButton}>
                <FontAwesome5 name="facebook-f" size={20} color="#2A3A56" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconButton}>
                <FontAwesome5 name="google" size={20} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5F5F5" },

  // Container Logo (Parte superior branca)
  topContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    minHeight: 180,
  },
  logo: { width: 250, height: 100 },

  // Container Verde (Formulário)
  bottomContainer: {
    flex: 1,
    backgroundColor: "#95C159",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  label: {
    color: "#2A3A56",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },

  // Inputs
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 50,
  },
  input: { flex: 1, color: "#333", fontSize: 16 },
  eyeIcon: { padding: 5 },

  // Botão de Ação
  button: {
    backgroundColor: "#2A3A56",
    height: 55,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 18 },
  forgotPassword: {
    color: "#2A3A56",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 40,
  },

  // Social Login Footer
  socialContainer: { alignItems: "center", marginTop: "auto" },
  socialText: { color: "#2A3A56", fontSize: 14, marginBottom: 15 },
  socialIconsRow: { flexDirection: "row" },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#2A3A56",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
});
