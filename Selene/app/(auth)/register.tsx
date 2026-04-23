import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
// Reaproveite os mesmos estilos do Login
const styles = StyleSheet.create({ /* ...mesmos do login... */ });