import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome_completo: name, // Campo esperado pelo seu back
        email: email.trim().toLowerCase(),
        senha: password      // Campo esperado pelo seu back
      };

      const response = await axios.post('https://selene-mobile.onrender.com/api/v1/auth/registrar', payload);

      if (response.data.success) {
        Alert.alert("Sucesso", "Conta criada! Agora faça o seu login.", [
          { text: "OK", onPress: () => router.replace('/(auth)/') }
        ]);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      Alert.alert("Erro", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} backgroundColor="#121212">
      <View style={styles.container}>
        <Text style={styles.title}>Selene</Text>
        <Text style={styles.subtitle}>Crie a sua conta</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Nome Completo" 
          placeholderTextColor="#888" 
          value={name}
          onChangeText={setName}
        />

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
          placeholder="Senha (mín. 6 caracteres)" 
          placeholderTextColor="#888" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Já tem conta? Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 25 },
  title: { fontSize: 42, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: 40, fontSize: 16 },
  input: { backgroundColor: '#1E1E1E', color: '#fff', padding: 18, borderRadius: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  link: { color: '#888', textAlign: 'center', marginTop: 25, fontSize: 15 }
});