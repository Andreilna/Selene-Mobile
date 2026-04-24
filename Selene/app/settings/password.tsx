import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function PasswordScreen() {
  const router = useRouter();

  const InputField = ({ label, placeholder }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput placeholder={placeholder} secureTextEntry style={styles.input} placeholderTextColor="#A0A0A0" />
        <Ionicons name="eye-outline" size={20} color="#00D1A0" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#2A3A56" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações Senha</Text>
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>AL</Text></View>
            <Octicons name="bell" size={24} color="#F5F5F5" />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentCard}>
        <InputField label="Senha Atual:" placeholder="••••••••••••" />
        <InputField label="Nova Senha:" placeholder="••••••••••••" />
        <InputField label="Confirmar Senha:" placeholder="••••••••••••" />

        <TouchableOpacity style={styles.mainButton}>
          <Text style={styles.buttonText}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  topSection: { backgroundColor: '#95C159', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 60, paddingHorizontal: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 10, fontWeight: 'bold', color: '#2A3A56' },
  contentCard: { flex: 1, backgroundColor: '#FFF', marginTop: -30, marginHorizontal: 20, borderRadius: 30, padding: 25, elevation: 4 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2A3A56', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDFCED', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  input: { flex: 1, color: '#2A3A56', fontSize: 16 },
  mainButton: { backgroundColor: '#00D1A0', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});