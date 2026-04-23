import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Substitua pela sua URL do Render
      // const response = await axios.post('https://selene-backend.onrender.com/api/v1/auth/login', { email, password });
      Alert.alert("Sucesso", "Login realizado!");
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar com o servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selene</Text>
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.link}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#4CAF50', textAlign: 'center', marginTop: 20 }
});