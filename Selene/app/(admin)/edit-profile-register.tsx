import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function PerfilUsuarioScreen() {
  const router = useRouter();
  const [iniciais, setIniciais] = useState("US");

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
      } catch (e) {}
    };

    carregarDadosUsuario();
  }, []);

  // MOCK (depois você troca pelo item da API)
  const user = {
    nome: "Jorge Lima",
    nivel: "Produtor",
    criadoEm: "Usuário Criado Em 30 de Abril - 14:40",
    email: "Jorge1234@gmail.com",
    nascimento: "25/04/1988",
    telefone: "(13)99967-9976",
    endereco: "Rua 2, Num 45 Jd. Ipanema SP",
    senha: "Jprodutor2237",
  };

  const handleGoProfile = () => {
    router.push("/(admin)/profile-admin");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* HEADER */}
          <View style={styles.topContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={28} color="#2A3A56" />
              </TouchableOpacity>

              <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>Perfil Usuário</Text>
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

          {/* CARD PRINCIPAL */}
          <View style={styles.content}>
            <View style={styles.topCard}>
              <View>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.name}>{user.nome}</Text>

                <Text style={[styles.label, { marginTop: 10 }]}>
                  Nível Acesso
                </Text>
                <Text style={styles.level}>{user.nivel}</Text>
              </View>

              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/32.jpg",
                }}
                style={styles.image}
              />
            </View>

            <Text style={styles.created}>{user.criadoEm}</Text>

            {/* INFO */}
            <Text style={styles.sectionTitle}>Informações Cadastro</Text>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Feather name="mail" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Feather name="calendar" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Data Nascimento</Text>
                <Text style={styles.infoText}>{user.nascimento}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Feather name="phone" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoText}>{user.telefone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <MaterialIcons name="home" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoText}>{user.endereco}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Feather name="key" size={18} color="#fff" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Senha Acesso</Text>
                <Text style={styles.infoText}>{user.senha}</Text>
              </View>
            </View>

            {/* BOTÕES */}
            <TouchableOpacity style={styles.btnEdit}>
              <Text style={styles.btnEditText}>Editar Informações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnDelete}>
              <Text style={styles.btnDeleteText}>Excluir Produtor</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingHorizontal: 25,
    paddingTop: 30,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDFCED",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
  },

  topCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2A3A56",
  },

  level: {
    color: "#00D2B1",
    fontWeight: "bold",
    fontSize: 16,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },

  created: {
    marginTop: 10,
    fontSize: 12,
    color: "#666",
  },

  sectionTitle: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 10,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },

  iconBox: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#00D2B1",
    justifyContent: "center",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 11,
    color: "#666",
  },

  infoText: {
    fontSize: 13,
    color: "#2A3A56",
    fontWeight: "600",
  },

  btnEdit: {
    backgroundColor: "#F4C542",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },

  btnEditText: {
    fontWeight: "bold",
    color: "#2A3A56",
  },

  btnDelete: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },

  btnDeleteText: {
    fontWeight: "bold",
    color: "#fff",
  },
});
