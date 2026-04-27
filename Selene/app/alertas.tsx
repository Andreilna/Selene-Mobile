import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AlertasScreen() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alertas</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* FILTROS (TABS) */}
            <View style={styles.filterContainer}>
              <TouchableOpacity style={[styles.filterTab, styles.filterActive]}><Text style={styles.filterTextActive}>Total(2)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}><Text style={styles.filterText}>Alta(1)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}><Text style={styles.filterText}>Média(2)</Text></TouchableOpacity>
              <TouchableOpacity style={styles.filterTab}><Text style={styles.filterText}>Baixo(0)</Text></TouchableOpacity>
            </View>

            {/* CARDS DE ALERTA */}
            <AlertaCard 
              titulo="Risco elevado detectado" 
              sub="Detecção de possível contaminação por fungo invasor"
              estufa="Estufa 2"
              tempo="há 15 minutos"
              prioridade="Alta"
              corPrioridade="#E74C3C"
            />

            <AlertaCard 
              titulo="Umidade acima do ideal" 
              sub="Umidade está 5% acima do recomendado"
              estufa="Estufa 3"
              tempo="há cerca de 1 hora"
              prioridade="Média"
              corPrioridade="#95A5A6"
            />

            <Text style={styles.sectionTitle}>Últimas Análises</Text>
            
            {/* HORIZONTAL ANALISES */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.analiseScroll}>
              <AnaliseCard img="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400" data="05 de outubro, 15:25" local="Estufa 2 - Setor B" />
              <AnaliseCard img="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400" data="05 de outubro, 12:15" local="Estufa 5 - Setor A" />
            </ScrollView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Sub-componentes para organizar o código
function AlertaCard({ titulo, sub, estufa, tempo, prioridade, corPrioridade }: any) {
  return (
    <View style={styles.alertaCard}>
      <View style={styles.alertaHeader}>
        <View style={styles.alertaIconBg}>
           <MaterialIcons name="cancel" size={20} color="#E74C3C" />
        </View>
        <Text style={styles.alertaTitle}>{titulo}</Text>
        <View style={[styles.badge, { backgroundColor: corPrioridade }]}><Text style={styles.badgeText}>{prioridade}</Text></View>
      </View>
      <Text style={styles.alertaSub}>{sub}</Text>
      <Text style={styles.alertaFooter}>{estufa}    {tempo}</Text>
    </View>
  );
}

function AnaliseCard({ img, data, local }: any) {
  return (
    <View style={styles.analiseCard}>
      <Image source={{ uri: img }} style={styles.analiseImg} />
      <View style={styles.analiseInfo}>
        <Text style={styles.analiseText}><Feather name="calendar" size={10} /> {data}</Text>
        <Text style={styles.analiseText}><Feather name="map-pin" size={10} /> {local}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 20, paddingTop: 25 },
  filterContainer: { flexDirection: 'row', backgroundColor: '#F8F8F8', borderRadius: 15, padding: 5, marginBottom: 25 },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  filterActive: { backgroundColor: '#2A3A56' },
  filterTextActive: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  filterText: { color: '#666', fontSize: 11 },
  alertaCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 30, marginBottom: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  alertaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  alertaIconBg: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FDEDEC', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  alertaTitle: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#2A3A56' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  alertaSub: { fontSize: 13, color: '#666', marginLeft: 40, marginBottom: 10 },
  alertaFooter: { fontSize: 11, color: '#AAA', marginLeft: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginVertical: 15 },
  analiseScroll: { flexDirection: 'row' },
  analiseCard: { width: 220, marginRight: 15, backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 3, marginBottom: 20 },
  analiseImg: { width: '100%', height: 140 },
  analiseInfo: { padding: 10 },
  analiseText: { fontSize: 10, color: '#666', marginBottom: 3 }
});