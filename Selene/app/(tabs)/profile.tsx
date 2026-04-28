import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Octicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();

  // ==========================================
  // ESTADOS (STATES)
  // ==========================================
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [userData, setUserData] = useState({
    nome: '',
    id: '',
    iniciais: ''
  });

  // ==========================================
  // CARREGAMENTO DE DADOS DO STORAGE
  // ==========================================
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const nomeCompleto = await SecureStore.getItemAsync('userName');
        const userId = await SecureStore.getItemAsync('userId');
        const role = await SecureStore.getItemAsync('userRole'); 

        // Define se mostra as opções de Gerenciamento
        setIsAdmin(role === 'admin');

        if (nomeCompleto) {
          const partes = nomeCompleto.trim().split(' ');
          const init = partes.length > 1 
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();

          setUserData({
            nome: nomeCompleto,
            id: userId ? userId.substring(0, 8) : '25030024',
            iniciais: init
          });
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // ==========================================
  // LÓGICA DE LOGOUT (ENCERRAR SESSÃO)
  // ==========================================
  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/(auth)'); 
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      
      {/* ---------------------------------------------------------
          INÍCIO DO HEADER (FUNDO VERDE)
      ---------------------------------------------------------- */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.headerRight}>
            <View style={styles.miniAvatar}>
              <Text style={styles.miniAvatarText}>{userData.iniciais}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {/* ---------------------------------------------------------
          FIM DO HEADER (FUNDO VERDE)
      ---------------------------------------------------------- */}


      {/* ---------------------------------------------------------
          CARD DE PERFIL (BRANCO FLUTUANTE)
      ---------------------------------------------------------- */}
      <View style={styles.profileCard}>
        
        {/* FOTO DE PERFIL CIRCULAR */}
        <View style={styles.imageContainer}>
          <Image 
            source="https://i.pravatar.cc/300" 
            style={styles.profileImage}
          />
        </View>

        {/* NOME E ID DO USUÁRIO */}
        {loading ? (
          <ActivityIndicator size="large" color="#95C159" style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={styles.userName}>{userData.nome}</Text>
            <Text style={styles.userId}>ID: {userData.id}</Text>
          </>
        )}

        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          
          {/* SEÇÃO ADMINISTRATIVA (Condicional: só aparece para Admin) */}
          {isAdmin && (
            <View style={styles.adminSection}>
              <Text style={styles.sectionLabel}>Administração</Text>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/users')}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#2A3A56' }]}>
                  <Ionicons name="people-outline" size={22} color="#FFF" />
                </View>
                <Text style={styles.menuText}>Gerenciar Usuários</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin/sensors')}>
                <View style={[styles.menuIconContainer, { backgroundColor: '#2A3A56' }]}>
                  <Ionicons name="hardware-chip-outline" size={22} color="#FFF" />
                </View>
                <Text style={styles.menuText}>Gerenciar Sensores</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          )}

          {/* SEÇÃO DE CONFIGURAÇÕES PADRÃO */}
          <Text style={styles.sectionLabel}>Configurações</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/edit-profile')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#95C159' }]}>
              <Ionicons name="person-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/password')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#95C159' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Segurança</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#95C159' }]}>
              <Ionicons name="headset-outline" size={22} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Suporte</Text>
          </TouchableOpacity>

          {/* BOTÃO DE LOGOUT */}
          <TouchableOpacity style={[styles.menuItem, { marginTop: 10 }]} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FF4B4B' }]}>
              <MaterialCommunityIcons name="logout" size={22} color="#FFF" />
            </View>
            <Text style={[styles.menuText, { color: '#FF4B4B' }]}>Sair da Conta</Text>
          </TouchableOpacity>
          
        </ScrollView>
      </View>
      {/* ---------------------------------------------------------
          FIM DO CARD DE PERFIL
      ---------------------------------------------------------- */}

    </View>
  );
}

// ==========================================
// ESTILOS (STYLESHEET)
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  // Header Verde
  headerBackground: { 
    backgroundColor: '#95C159', 
    height: 180, 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50 
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25,
    paddingTop: 10
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniAvatar: { 
    width: 35, height: 35, borderRadius: 18, 
    backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#2A3A56'
  },
  miniAvatarText: { fontSize: 12, fontWeight: 'bold', color: '#2A3A56' },

  // Card Branco Central
  profileCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -60, 
    marginHorizontal: 20, 
    borderRadius: 40, 
    paddingTop: 70,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10
  },
  imageContainer: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 65,
    elevation: 4
  },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56', textAlign: 'center' },
  userId: { fontSize: 14, color: '#2A3A56', textAlign: 'center', opacity: 0.6, marginBottom: 25 },
  
  // Menu e Itens
  menuList: { paddingHorizontal: 25 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#A0A0A0', textTransform: 'uppercase', marginBottom: 15, marginLeft: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  menuIconContainer: { 
    width: 40, height: 40, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15
  },
  menuText: { fontSize: 16, fontWeight: '600', color: '#2A3A56' },
  adminSection: { marginBottom: 10 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
});