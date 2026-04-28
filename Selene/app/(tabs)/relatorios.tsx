import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// ==========================================
// DADOS MOCKADOS (EXEMPLOS DE RELATÓRIOS)
// ==========================================
const DATA = [
  { id: '1', title: 'Relatório #2 Exportado!', subtitle: 'Análise de fungos parasitas em compostos de shimeji.', date: '24 Abril - 17:00', type: 'bell' },
  { id: '2', title: 'Relatório #3 Exportado!', subtitle: 'Monitoramento cogumelo shimeji deformado.', date: '24 Abril - 17:00', type: 'bell' },
  { id: '3', title: 'Relatório #2 Alterado!', subtitle: 'Alteração no campo descrição.', date: '24 Abril - 17:00', type: 'edit' },
];

export default function RelatoriosScreen() {
  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [iniciais, setIniciais] = useState('US');
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RENDERIZAÇÃO DOS ITENS DA LISTA (CARDS)
  // ==========================================
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      {/* ÍCONE DINÂMICO BASEADO NO TIPO */}
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

        {/* ---------------------------------------------------------
            INÍCIO DO HEADER (VERDE SELENE)
        ---------------------------------------------------------- */}
        <View style={styles.header}>
          <View style={{ width: 30 }} />
          <Text style={styles.welcomeText}>Relatórios</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.avatarCircle}
              onPress={() => router.push('/profile')}
            >
              <Text style={styles.avatarText}>{iniciais}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>
        {/* ---------------------------------------------------------
            FIM DO HEADER
        ---------------------------------------------------------- */}


        {/* ---------------------------------------------------------
            CORPO DA PÁGINA (LISTAGEM BRANCA)
        ---------------------------------------------------------- */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Hoje</Text>

          <FlatList
            data={DATA}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
        {/* ---------------------------------------------------------
            FIM DO CORPO
        ---------------------------------------------------------- */}

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  // Estrutura Principal
  container: { flex: 1, backgroundColor: '#95C159' },

  // Header Superior
  topContainer: { backgroundColor: '#95C159', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingBottom: 40, paddingHorizontal: 20 },
  topContent: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35, marginTop: 15 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  subwelcomeText: { fontSize: 14, color: '#2A3A56', opacity: 0.8 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatarCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  resumoContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 25 },
  resumoItem: { alignItems: 'center' },
  resumoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  resumoLabel: { fontSize: 14, color: '#2A3A56', fontWeight: 'bold' },
  resumoValue: { fontSize: 48, fontWeight: 'bold', color: '#F5F5F5' },
  verticalDivider: { width: 1.5, height: 60, backgroundColor: '#2A3A56', opacity: 0.3 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDFCED', borderRadius: 15, height: 35, padding: 3, marginBottom: 10 },
  progressBar: { backgroundColor: '#2A3A56', height: '100%', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15 },
  progressText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  progressValueText: { position: 'absolute', right: 15, color: '#A0A0A0', fontSize: 14, fontWeight: 'bold' },
  progressDescriptionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 5 },
  progressDescriptionText: { fontSize: 14, color: '#2A3A56', fontWeight: 'bold' },

  // Painel Branco Arredondado
  content: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 30
  },
  sectionTitle: { fontSize: 14, color: '#666', marginBottom: 20, fontWeight: '600' },

  // Estilo do Item/Card
  card: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 5
  },
  textContainer: { flex: 1, marginLeft: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  itemSubtitle: { fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  itemDate: { fontSize: 12, color: '#007AFF', marginTop: 10, textAlign: 'right' },

  // Separador de Itens
  separator: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15, marginLeft: 55 }
});