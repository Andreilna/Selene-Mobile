import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AdminUsers() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('user'); // user ou admin
  const [loading, setLoading] = useState(false);

  const handleCreateUser = () => {
    if (!nome || !email) return Alert.alert("Erro", "Preencha os campos básicos.");
    setLoading(true);
    // Aqui vai seu fetch para a API
    setTimeout(() => {
      Alert.alert("Sucesso", "Usuário cadastrado!");
      setLoading(false);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: João Silva" />

        <Text style={styles.label}>E-mail</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={(t) => setEmail(t.toLowerCase())} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nível de Acesso</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.chip, cargo === 'user' && styles.chipActive]} 
            onPress={() => setCargo('user')}
          >
            <Text style={cargo === 'user' ? styles.chipTextActive : styles.chipText}>Usuário</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.chip, cargo === 'admin' && styles.chipActive]} 
            onPress={() => setCargo('admin')}
          >
            <Text style={cargo === 'admin' ? styles.chipTextActive : styles.chipText}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateUser} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar Perfil</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 4 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2A3A56', marginBottom: 8 },
  input: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 15, marginBottom: 20, fontSize: 16 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  chip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, borderWidth: 1, borderColor: '#2A3A56' },
  chipActive: { backgroundColor: '#2A3A56' },
  chipText: { color: '#2A3A56', fontWeight: 'bold' },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },
  button: { backgroundColor: '#95C159', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 16 }
});