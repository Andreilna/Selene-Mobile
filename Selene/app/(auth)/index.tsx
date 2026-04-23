import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://selene-mobile.onrender.com/api/v1/auth/login', { 
        email: email.trim().toLowerCase(), 
        senha: password // Campo esperado pelo seu back
      });

      if (response.data.success) {
        // SALVAR O TOKEN
        const token = response.data.data.token;
        await SecureStore.setItemAsync('userToken', token);

        Alert.alert("Sucesso", "Bem-vindo ao Selene!");
        router.replace('/(tabs)/home'); 
      }
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "E-mail ou senha inválidos.";
      Alert.alert("Erro", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selene</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="E-mail" 
        placeholderTextColor="#888" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Senha" 
        placeholderTextColor="#888" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.7 }]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Ainda não tem conta? <Text style={{fontWeight: 'bold'}}>Registe-se</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 25 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 50 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { color: '#4CAF50', textAlign: 'center', marginTop: 25, fontSize: 15 }
});