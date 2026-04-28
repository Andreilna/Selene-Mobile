import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function PasswordScreen() {
  const router = useRouter();
  
  // ==========================================
  // ESTADOS (STATES)
  // ==========================================
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [iniciais, setIniciais] = useState('AL');

  // Visibilidade das senhas independente
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  // ==========================================
  // LOGICA DE INICIAIS
  // ==========================================
  useEffect(() => {
    const carregarIniciais = async () => {
      const nome = await SecureStore.getItemAsync('userName');
      if (nome) {
        const partes = nome.trim().split(' ');
        const init = partes.length > 1 
          ? (partes[0][0] + partes[1][0]).toUpperCase()
          : partes[0][0].toUpperCase();
        setIniciais(init);
      }
    };
    carregarIniciais();
  }, []);

  // ==========================================
  // CHAMADA API
  // ==========================================
  const handleUpdatePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "A nova senha e a confirmação não são iguais.");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        Alert.alert("Erro de Sessão", "Acesso não encontrado. Faça login novamente.");
        setLoading(false);
        return;
      }

      const response = await fetch('https://selene-mobile.onrender.com/api/v1/auth/alterar-senha', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual: senhaAtual,
          novaSenha: novaSenha
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Sucesso!", "Sua senha foi atualizada com segurança.");
        router.back();
      } else {
        Alert.alert("Ops!", data.message || "Algo deu errado ao trocar a senha.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER VERDE SELENE */}
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Segurança</Text>
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{iniciais}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* FORMULÁRIO EM CARD */}
      <View style={styles.contentCard}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.cardInfo}>Mantenha sua conta segura atualizando sua senha regularmente.</Text>

          {/* Senha Atual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha Atual:</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                placeholder="••••••••••••" 
                secureTextEntry={!showSenhaAtual}
                style={styles.input} 
                placeholderTextColor="#A0A0A0"
                value={senhaAtual}
                autoCapitalize="none"
                onChangeText={setSenhaAtual}
              />
              <TouchableOpacity onPress={() => setShowSenhaAtual(!showSenhaAtual)} style={styles.eyeIcon}>
                <Feather name={showSenhaAtual ? "eye" : "eye-off"} size={20} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nova Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova Senha:</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                placeholder="••••••••••••" 
                secureTextEntry={!showNovaSenha}
                style={styles.input} 
                placeholderTextColor="#A0A0A0"
                value={novaSenha}
                autoCapitalize="none"
                onChangeText={setNovaSenha}
              />
              <TouchableOpacity onPress={() => setShowNovaSenha(!showNovaSenha)} style={styles.eyeIcon}>
                <Feather name={showNovaSenha ? "eye" : "eye-off"} size={20} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Nova Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Nova Senha:</Text>
            <View style={styles.inputWrapper}>
              <TextInput 
                placeholder="••••••••••••" 
                secureTextEntry={!showConfirmarSenha}
                style={styles.input} 
                placeholderTextColor="#A0A0A0"
                value={confirmarSenha}
                autoCapitalize="none"
                onChangeText={setConfirmarSenha}
              />
              <TouchableOpacity onPress={() => setShowConfirmarSenha(!showConfirmarSenha)} style={styles.eyeIcon}>
                <Feather name={showConfirmarSenha ? "eye" : "eye-off"} size={20} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.mainButton, loading && { opacity: 0.7 }]} 
            onPress={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Salvar Nova Senha</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  topSection: { 
    backgroundColor: '#95C159', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    paddingBottom: 60, 
    paddingHorizontal: 25 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#EDFCED', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: '#2A3A56' },
  contentCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -30, 
    marginHorizontal: 20, 
    marginBottom: 20,
    borderRadius: 30, 
    padding: 25, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  cardInfo: { fontSize: 13, color: '#666', marginBottom: 25, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2A3A56', marginBottom: 8 },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FBF8', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  input: { flex: 1, color: '#2A3A56', fontSize: 16 },
  mainButton: { 
    backgroundColor: '#2A3A56', 
    height: 55, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  eyeIcon: { padding: 5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});