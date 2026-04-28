import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Função para lidar com a deleção (lógica futura de API)
  const handleDelete = () => {
    if (!password) {
      Alert.alert("Erro", "Por favor, insira sua senha para confirmar.");
      return;
    }

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => console.log("Lógica de deleção aqui") 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* SEÇÃO VERDE (HEADER) */}
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2A3A56" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Deletar Conta</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
            <Octicons name="bell" size={24} color="#F5F5F5" />
          </View>
        </SafeAreaView>
      </View>

      {/* CARD DE CONTEÚDO (BRANCO) */}
      <ScrollView 
        style={styles.contentCard} 
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.warningTitle}>
          Você Tem Certeza Que Deseja Deletar Sua Conta?
        </Text>
        
        {/* INFO BOX - ALERTAS */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Esta ação excluirá permanentemente todos os seus dados e você não poderá recuperá-los. 
            Por favor, tenha em mente o seguinte antes de prosseguir:
          </Text>
          <Text style={styles.bullet}>• Todas as suas informações serão deletadas.</Text>
          <Text style={styles.bullet}>• Você não poderá acessar sua conta nem qualquer informação relacionada.</Text>
          <Text style={styles.bullet}>• Esta ação não pode ser desfeita.</Text>
        </View>

        <Text style={styles.confirmLabel}>
          Por Favor Insira Sua Senha Para Confirmar:
        </Text>

        {/* INPUT DE SENHA COM TOGGLE DE VISIBILIDADE */}
        <View style={styles.inputWrapper}>
          <TextInput 
            secureTextEntry={!showPassword} 
            placeholder="••••••••••••" 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#A0A0A0"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#00D1A0" 
            />
          </TouchableOpacity>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleDelete}>
          <Text style={styles.btnText}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  
  avatarCircle: { 
    width: 32, height: 32, borderRadius: 16, 
    backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center' 
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
    shadowOpacity: 0.1,
    shadowRadius: 10
  },

  warningTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#2A3A56', 
    textAlign: 'center', 
    marginBottom: 20 
  },

  infoBox: { backgroundColor: '#EDFCED', padding: 15, borderRadius: 15, marginBottom: 25 },
  infoText: { fontSize: 13, color: '#2A3A56', marginBottom: 10, lineHeight: 18 },
  bullet: { fontSize: 12, color: '#2A3A56', marginBottom: 5, paddingLeft: 5 },

  confirmLabel: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#2A3A56', 
    textAlign: 'center', 
    marginBottom: 15 
  },

  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EDFCED', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 50, 
    marginBottom: 20 
  },
  input: { flex: 1, color: '#2A3A56' },

  confirmButton: { 
    backgroundColor: '#00D1A0', 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnText: { color: '#FFF', fontWeight: 'bold' },

  cancelButton: { 
    backgroundColor: '#EDFCED', 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  cancelText: { color: '#2A3A56', fontWeight: 'bold' }
});