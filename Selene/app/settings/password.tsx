import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function PasswordScreen() {
  const router = useRouter();
  
  // Estados para os campos
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleUpdatePassword = async () => {
    // 1. Validações Iniciais
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
      // 2. Recupera o token do mesmo lugar que o Login salvou
      const token = await SecureStore.getItemAsync('userToken');

      if (!token) {
        Alert.alert("Erro de Sessão", "Não encontramos seu acesso. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      // 3. Chamada para a API no Render
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
        // Exibe a mensagem de erro que vem do seu Backend (ex: "Senha atual incorreta")
        Alert.alert("Ops!", data.message || "Algo deu errado ao trocar a senha.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro de Conexão", "Não foi possível falar com o servidor. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com a cor verde Selene */}
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Segurança</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => setShowPasswords(!showPasswords)}>
               <Ionicons name={showPasswords ? "eye-off-outline" : "eye-outline"} size={22} color="#2A3A56" />
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Card de Inputs */}
      <View style={styles.contentCard}>
        <Text style={styles.cardInfo}>Mantenha sua conta segura atualizando sua senha regularmente.</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha Atual:</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="••••••••••••" 
              secureTextEntry={!showPasswords}
              style={styles.input} 
              placeholderTextColor="#A0A0A0"
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
            <Ionicons name="lock-closed-outline" size={20} color="#00D1A0" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nova Senha:</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="••••••••••••" 
              secureTextEntry={!showPasswords}
              style={styles.input} 
              placeholderTextColor="#A0A0A0"
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <Ionicons name="key-outline" size={20} color="#00D1A0" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Nova Senha:</Text>
          <View style={styles.inputWrapper}>
            <TextInput 
              placeholder="••••••••••••" 
              secureTextEntry={!showPasswords}
              style={styles.input} 
              placeholderTextColor="#A0A0A0"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <Ionicons name="shield-checkmark-outline" size={20} color="#00D1A0" />
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
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatarCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#EDFCED', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { fontSize: 10, fontWeight: 'bold', color: '#2A3A56' },
  contentCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -30, 
    marginHorizontal: 20, 
    borderRadius: 30, 
    padding: 25, 
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    marginTop: 20 
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});