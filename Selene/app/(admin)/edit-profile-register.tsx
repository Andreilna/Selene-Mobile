import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function PerfilUsuarioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [iniciaisLogado, setIniciaisLogado] = useState("US");

  const formatarData = (data: any) => {
    if (!data) return "N/A";
    const d = new Date(data);
    return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString("pt-BR");
  };

  useEffect(() => {
    const carregarIniciaisHeader = async () => {
      try {
        const nomeSalvo = await SecureStore.getItemAsync("userName");
        if (nomeSalvo) {
          const partes = nomeSalvo.trim().split(" ");
          const init = partes.length > 1 ? (partes[0][0] + partes[1][0]).toUpperCase() : partes[0][0].toUpperCase();
          setIniciaisLogado(init);
        }
      } catch (e) { console.error(e); }
    };
    carregarIniciaisHeader();
  }, [id]);

  useEffect(() => {
    const buscarDadosUsuario = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync("userToken");
        const buscaId = id.toString().replace(/"/g, '').trim();

        // --- TENTATIVA 1: Rota de Usuário Comum ---
        let response = await fetch(`https://selene-mobile.onrender.com/api/v1/users/${buscaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let json = await response.json();

        // Se a rota de usuário falhar (404), tenta a rota de Admin
        if (!response.ok || json.message === "Rota não encontrada") {
          console.log(`Tentando fallback para rota de admin para o ID: ${buscaId}`);
          
          // --- TENTATIVA 2: Rota de Admin (ou listagem de admin) ---
          // Como a sua API parece não ter um GET direto de admin por ID, 
          // vamos buscar na listagem e filtrar (conforme seu código original fazia)
          const resAdmin = await fetch(`https://selene-mobile.onrender.com/api/v1/admin/listar`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const jsonAdmin = await resAdmin.json();
          const lista = jsonAdmin.data || jsonAdmin.usuarios || [];
          
          const adminEncontrado = lista.find((a: any) => (a._id || a.id) === buscaId);

          if (adminEncontrado) {
            setUserData(adminEncontrado);
          } else {
             Alert.alert("Erro", "Perfil não encontrado em nenhuma das rotas.");
          }
        } else {
          // Se a primeira tentativa funcionou
          setUserData(json.data || json.usuario || json);
        }

      } catch (error) {
        console.error("Erro fatal na busca:", error);
      } finally {
        setLoading(false);
      }
    };
    buscarDadosUsuario();
  }, [id]);

  // Mapeamento dos campos baseado no que costuma vir das APIs de vocês
  const nome = userData?.nome_completo || userData?.nome || userData?.usuario || "Não informado";
  const email = userData?.email || "Não informado";
  const telefone = userData?.telefone || "N/A";
  const endereco = userData?.endereco || "Endereço não informado";
  const nivelAcesso = userData?.nivel_acesso || (userData?.cargo ? "admin" : "produtor");
  
  const nivelLabel = nivelAcesso === "superadmin" ? "Admin" : (nivelAcesso === "admin" ? "Administrador" : "Produtor");
  const foto = userData?.foto_perfil || `https://ui-avatars.com/api/?name=${nome}&background=00D2B1&color=fff`;

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#2A3A56" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.topContainer}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={28} color="#2A3A56" />
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>Perfil Usuário</Text>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.avatarCircle} onPress={() => router.push("/(admin)/profile-admin")}>
                  <Text style={styles.avatarText}>{iniciaisLogado}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.topCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.name}>{nome}</Text>
                <Text style={[styles.label, { marginTop: 10 }]}>Nível Acesso</Text>
                <Text style={styles.level}>{nivelLabel}</Text>
              </View>
              <Image source={{ uri: foto }} style={styles.image} />
            </View>

            <Text style={styles.sectionTitle}>Informações Cadastro</Text>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}><Feather name="mail" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>{email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}><Feather name="calendar" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.infoLabel}>Data Nascimento</Text>
                <Text style={styles.infoText}>{formatarData(userData?.data_nascimento)}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}><Feather name="phone" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoText}>{telefone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}><MaterialIcons name="home" size={18} color="#fff" /></View>
              <View>
                <Text style={styles.infoLabel}>Endereço</Text>
                <Text style={styles.infoText}>{endereco}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnEdit} onPress={() => router.push({ pathname: "/(admin)/edit-profile", params: { id } })}>
              <Text style={styles.btnEditText}>Editar Informações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnDelete} onPress={() => Alert.alert("Aviso", `Deseja excluir o ID: ${id}?`)}>
              <Text style={styles.btnDeleteText}>Excluir Usuário</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#95C159" },
  topContainer: { backgroundColor: "#95C159", borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 30, paddingTop: 10, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  welcomeText: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  headerIcons: { flexDirection: "row", alignItems: "center", gap: 15 },
  avatarCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: "#EDFCED", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 16, fontWeight: "bold", color: "#2A3A56" },
  textContainer: { flex: 1, marginLeft: 20 },
  content: { flex: 1, backgroundColor: "#FFF", borderTopLeftRadius: 60, borderTopRightRadius: 60, paddingHorizontal: 25, paddingTop: 30, paddingBottom: 40 },
  topCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12, color: "#666" },
  name: { fontSize: 22, fontWeight: "bold", color: "#2A3A56" },
  level: { color: "#00D2B1", fontWeight: "bold", fontSize: 16 },
  image: { width: 120, height: 120, borderRadius: 20 },
  sectionTitle: { marginTop: 20, fontWeight: "bold", color: "#2A3A56", marginBottom: 10 },
  infoItem: { flexDirection: "row", alignItems: "center", marginBottom: 15, gap: 10 },
  iconBox: { width: 35, height: 35, borderRadius: 10, backgroundColor: "#00D2B1", justifyContent: "center", alignItems: "center" },
  infoLabel: { fontSize: 11, color: "#666" },
  infoText: { fontSize: 13, color: "#2A3A56", fontWeight: "600" },
  btnEdit: { backgroundColor: "#F4C542", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 20 },
  btnEditText: { fontWeight: "bold", color: "#2A3A56" },
  btnDelete: { backgroundColor: "#E74C3C", padding: 15, borderRadius: 25, alignItems: "center", marginTop: 10 },
  btnDeleteText: { fontWeight: "bold", color: "#fff" },
});