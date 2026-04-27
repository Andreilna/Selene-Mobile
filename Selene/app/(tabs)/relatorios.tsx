import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const DATA = [
  { id: '1', title: 'Relatório #2 Exportado!', subtitle: 'Análise de fungos parasitas em compostos de shimeji.', date: '24 Abril - 17:00', type: 'bell' },
  { id: '2', title: 'Relatório #3 Exportado!', subtitle: 'Monitoramento cogumelo shimeji deformado.', date: '24 Abril - 17:00', type: 'bell' },
  { id: '3', title: 'Relatório #2 Alterado!', subtitle: 'Alteração no campo descrição.', date: '24 Abril - 17:00', type: 'edit' },
];

export default function RelatoriosScreen() {
  const router = useRouter();
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: item.type === 'bell' ? '#00D2B1' : '#00D2B1' }]}>
        <Feather name={item.type === 'bell' ? "bell" : "trending-down"} size={20} color="white" />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.itemTitle}>{item.title}</Text>
        </View>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <View style={{ width: 30 }} />
          <Text style={styles.headerTitle}>Relatórios</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          <FlatList
            data={DATA}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 30 },
  sectionTitle: { fontSize: 14, color: '#666', marginBottom: 20, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  textContainer: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  itemSubtitle: { fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  itemDate: { fontSize: 12, color: '#007AFF', marginTop: 10, textAlign: 'right' },
  separator: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15, marginLeft: 55 }
});