import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function DetalheEstufa() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [estufa, setEstufa] = useState<any>(null);

  const fetchDetalhes = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`https://selene-mobile.onrender.com/api/v1/estufas/detalhes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setEstufa(response.data.data);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados desta estufa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetalhes(); }, [id]);

  if (loading) return <View style={styles.loadingCenter}><ActivityIndicator size="large" color="#95C159" /></View>;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{estufa?.nome || 'Estufa'}</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* INFOS E IMAGEM */}
            <View style={styles.topInfoRow}>
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    <MaterialCommunityIcons name="grid" size={14} /> Total Compostos
                  </Text>
                  <Text style={styles.statValue}>{estufa?.quantidade_compostos || 0}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>
                    <MaterialCommunityIcons name="magnify" size={14} /> Compostos Análisados
                  </Text>
                  <Text style={[styles.statValue, { color: '#00D2B1' }]}>{estufa?.quantidade_compostos || 0}</Text>
                </View>
              </View>
              
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: estufa?.endereco_camera || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400' }} 
                  style={styles.estufaImage} 
                />
              </View>
            </View>

            {/* PROGRESSO */}
            <View style={styles.progressSection}>
               <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '100%' }]} />
               </View>
               <View style={styles.progressCheck}>
                  <Feather name="check-square" size={16} color="#666" />
                  <Text style={styles.progressText}> Todos Compostos Analisados</Text>
               </View>
            </View>

            <Text style={styles.monthLabel}>Julho</Text>
            
            {/* CARDS DE SENSORES */}
            <SensorCard icon="alert-triangle" label="Pragas" value="56%" color="#FFB800" date="30 Abril - 18:19" />
            <SensorCard icon="droplet" label="Umidade" value="10%" color="#00D2B1" date="30 Abril - 18:19" />
            <SensorCard icon="thermometer" label="Temperatura" value="21º C" color="#95C159" date="30 Abril - 18:19" />

          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function SensorCard({ icon, label, value, color, date }: any) {
  return (
    <View style={styles.sensorCard}>
      <View style={styles.sensorIconBg}><Feather name={icon} size={22} color={color} /></View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.sensorLabel}>{label}</Text>
        <Text style={styles.sensorDate}>{date}</Text>
      </View>
      <View style={styles.vDivider} />
      <Text style={styles.sensorValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 35 },
  topInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  statsContainer: { flex: 1 },
  statBox: { marginBottom: 20 },
  statLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#2A3A56' },
  imageWrapper: { borderWidth: 3, borderColor: '#007AFF', borderRadius: 20, padding: 2 },
  estufaImage: { width: 140, height: 140, borderRadius: 18 },
  progressSection: { marginBottom: 30 },
  progressBarBg: { height: 30, backgroundColor: '#00D2B1', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  progressBarFill: { position: 'absolute', left: 0, height: '100%', backgroundColor: '#00D2B1', borderRadius: 15 },
  progressCheck: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  progressText: { fontSize: 13, color: '#666' },
  monthLabel: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginBottom: 15 },
  sensorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  sensorIconBg: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center' },
  sensorLabel: { fontSize: 15, fontWeight: 'bold', color: '#2A3A56' },
  sensorDate: { fontSize: 11, color: '#007AFF' },
  vDivider: { width: 1, height: 30, backgroundColor: '#EEE', marginHorizontal: 15 },
  sensorValue: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' }
});