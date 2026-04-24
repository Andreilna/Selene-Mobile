import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    geral: true, som: true, celular: true, vibrar: true, personalizadas: false, baixos: false
  });

  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const Row = ({ label, value, onToggle }: any) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onToggle} 
        trackColor={{ false: '#D1D1D1', true: '#00D1A0' }} 
        thumbColor="#FFF"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#2A3A56" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Sistema Notificações</Text>
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>AL</Text></View>
            <Octicons name="bell" size={24} color="#F5F5F5" />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentCard}>
        <Row label="Notificações Gerais" value={settings.geral} onToggle={() => toggle('geral')} />
        <Row label="Som" value={settings.som} onToggle={() => toggle('som')} />
        <Row label="Som Celular" value={settings.celular} onToggle={() => toggle('celular')} />
        <Row label="Vibrar" value={settings.vibrar} onToggle={() => toggle('vibrar')} />
        <Row label="Notificações Personalizadas" value={settings.personalizadas} onToggle={() => toggle('personalizadas')} />
        <Row label="Baixos Alertas" value={settings.baixos} onToggle={() => toggle('baixos')} />
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  rowText: { fontSize: 15, color: '#2A3A56', fontWeight: '500' }
});