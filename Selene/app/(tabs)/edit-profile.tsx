import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Switch,
  Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function EditProfileScreen() {
  const router = useRouter();
  
  // Estados para os inputs baseados no seu design
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('+44 555 5555 55');
  const [email, setEmail] = useState('');
  const [notificacoes, setNotificacoes] = useState(true);
  const [salvarLogin, setSalvarLogin] = useState(true);
  const [idExibicao, setIdExibicao] = useState('00000000');
  const [iniciais, setIniciais] = useState('--');

  useEffect(() => {
    const carregarDados = async () => {
      const nomeSalvo = await SecureStore.getItemAsync('userName');
      const emailSalvo = await SecureStore.getItemAsync('userEmail'); // Salve o email no Login também!
      const idSalvo = await SecureStore.getItemAsync('userId');

      if (nomeSalvo) {
        setNome(nomeSalvo);
        const partes = nomeSalvo.trim().split(' ');
        setIniciais(partes.length > 1 ? (partes[0][0] + partes[1][0]).toUpperCase() : partes[0][0].toUpperCase());
      }
      if (emailSalvo) setEmail(emailSalvo);
      if (idSalvo) setIdExibicao(idSalvo.substring(0, 8));
    };
    carregarDados();
  }, []);

  const handleSalvar = () => {
    Alert.alert("Sucesso", "Alterações salvas com sucesso!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.headerRight}>
            <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{iniciais}</Text></View>
            <Octicons name="bell" size={24} color="#FFF" />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image source="https://i.pravatar.cc/300" style={styles.profileImage} />
          <TouchableOpacity style={styles.cameraBtn}>
            <Ionicons name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{nome}</Text>
        <Text style={styles.userId}>ID: {idExibicao}</Text>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Configurações Usuário</Text>

          <Text style={styles.label}>Nome:</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" />

          <Text style={styles.label}>Telefone:</Text>
          <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

          <Text style={styles.label}>Email:</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Ativar Notificações</Text>
            <Switch value={notificacoes} onValueChange={setNotificacoes} trackColor={{ false: "#767577", true: "#00D1A0" }} />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.label}>Salvar Login</Text>
            <Switch value={salvarLogin} onValueChange={setSalvarLogin} trackColor={{ false: "#767577", true: "#00D1A0" }} />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
            <Text style={styles.saveBtnText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBackground: { backgroundColor: '#95C159', height: 180, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniAvatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2A3A56' },
  miniAvatarText: { fontSize: 12, fontWeight: 'bold', color: '#2A3A56' },
  profileCard: { flex: 1, backgroundColor: '#FFF', marginTop: -50, marginHorizontal: 20, borderRadius: 40, paddingTop: 60, elevation: 5, marginBottom: 20 },
  imageContainer: { position: 'absolute', top: -60, alignSelf: 'center' },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF' },
  cameraBtn: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#00D1A0', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWeight: 2, borderColor: '#FFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56', textAlign: 'center' },
  userId: { fontSize: 14, color: '#2A3A56', textAlign: 'center', opacity: 0.6, marginBottom: 20 },
  form: { paddingHorizontal: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2A3A56', marginBottom: 8 },
  input: { backgroundColor: '#E8F5E9', borderRadius: 12, height: 45, paddingHorizontal: 15, marginBottom: 20, color: '#2A3A56' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  saveBtn: { backgroundColor: '#00D1A0', height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 30 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});