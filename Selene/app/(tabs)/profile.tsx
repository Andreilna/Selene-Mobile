import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface UserData {
  nome_completo: string;
  email: string;
  foto_perfil?: string;
  telefone?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // 1. Tenta recuperar o token do armazenamento local
      const token = await SecureStore.getItemAsync('userToken');
      
      console.log("DEBUG: Token recuperado do Store ->", token ? "Token existe" : "Token VAZIO");

      if (!token) {
        Alert.alert("Sessão expirada", "Por favor, faça login novamente.");
        router.replace('/(auth)/');
        return;
      }

      // 2. Faz a chamada ao backend enviando o token no cabeçalho Authorization
      const response = await axios.get('https://selene-mobile.onrender.com/api/v1/auth/perfil', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error: any) {
      console.log("LOG DE ERRO:", error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert("Erro de Autenticação", "Sua sessão expirou.");
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.replace('/(auth)/');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user?.foto_perfil ? (
          <Image 
            source={{ uri: `https://selene-mobile.onrender.com${user.foto_perfil}` }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.nome_completo?.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name}>{user?.nome_completo || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{user?.telefone || 'Não informado'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#4CAF50' },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 50, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  email: { color: '#888', fontSize: 16 },
  infoSection: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 15, marginTop: 20 },
  label: { color: '#666', fontSize: 12, textTransform: 'uppercase', marginBottom: 5 },
  value: { color: '#fff', fontSize: 16 },
  logoutButton: { marginTop: 'auto', marginBottom: 30, padding: 15, alignItems: 'center' },
  logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 }
});