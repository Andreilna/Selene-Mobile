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
import { Ionicons, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nome: '',
    id: '',
    iniciais: ''
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Puxa o nome que o ADM cadastrou e que foi salvo no Login
        const nomeCompleto = await SecureStore.getItemAsync('userName');
        const userId = await SecureStore.getItemAsync('userId');

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

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          router.replace('/(auth)'); 
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Verde - Fundo superior */}
      <View style={styles.headerBackground}>
        <SafeAreaView style={styles.headerContent}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.headerRight}>
            <View style={styles.miniAvatar}>
              <Text style={styles.miniAvatarText}>{userData.iniciais}</Text>
            </View>
            <TouchableOpacity>
              <Octicons name="bell" size={24} color="#2A3A56" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Card Branco Central */}
      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image 
            source="https://i.pravatar.cc/300" // Placeholder de foto
            style={styles.profileImage}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#95C159" style={{ marginTop: 20 }} />
        ) : (
          <>
            <Text style={styles.userName}>{userData.nome}</Text>
            <Text style={styles.userId}>ID: {userData.id}</Text>
          </>
        )}

        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {/* Edit Profile */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/edit-profile')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#00D1A0' }]}>
              <Ionicons name="person-outline" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Security (Onde ele vai mudar a senha) */}
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/password')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#00D1A0' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Security</Text>
          </TouchableOpacity>

          {/* Suporte */}
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#00D1A0' }]}>
              <Ionicons name="headset-outline" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Suporte</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FF4B4B' }]}>
              <MaterialCommunityIcons name="logout" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBackground: { 
    backgroundColor: '#95C159', 
    height: 200, 
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
    backgroundColor: '#F5F5F5',
    padding: 5,
    borderRadius: 65,
  },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56', textAlign: 'center' },
  userId: { fontSize: 14, color: '#2A3A56', textAlign: 'center', opacity: 0.6, marginBottom: 30 },
  menuList: { paddingHorizontal: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  menuIconContainer: { 
    width: 45, height: 45, borderRadius: 15, 
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15
  },
  menuText: { fontSize: 16, fontWeight: '600', color: '#2A3A56' }
});