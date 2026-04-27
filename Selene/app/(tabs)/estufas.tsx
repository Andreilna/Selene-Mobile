import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface Estufa {
  _id: string;
  nome: string;
  data_criacao: string;
  status: string;
}

export default function EstufasScreen() {
  const router = useRouter();
  const [estufas, setEstufas] = useState<Estufa[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar as estufas do banco
  const fetchEstufas = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      
      const response = await axios.get('https://selene-mobile.onrender.com/api/v1/estufas/listar', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setEstufas(response.data.data);
      }
    } catch (error: any) {
      console.log("Erro ao buscar dados:", error.response?.data || error.message);
      // Se o erro for de "Usuário não encontrado", vale avisar para relogar
      if (error.response?.status === 401) {
        Alert.alert("Sessão Expirada", "Por favor, faça login novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstufas();
  }, []);

  const renderItem = ({ item }: { item: Estufa }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => router.push(`/estufa/${item._id}`)}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="greenhouse" size={28} color="#00D2B1" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.estufaNome}>{item.nome}</Text>
          <Text style={styles.estufaData}>{item.data_criacao}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'Médio' ? styles.statusMedio : styles.statusBaixo
        ]}>
          <Text style={styles.statusText}>{item.status || 'Ativo'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <Text style={styles.headerTitle}>Estufas</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileText}>LB</Text>
            </View>
            <TouchableOpacity onPress={fetchEstufas}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#95C159" />
            </View>
          ) : (
            <>
              {/* RESUMO DE STATS */}
              <View style={styles.statsSummary}>
                <Text style={styles.statsText}>
                  Total Estufas: <Text style={styles.statsValue}>{estufas.length}</Text>
                </Text>
                <View style={styles.statsDivider} />
                <Text style={styles.statsText}>
                  Analizadas: <Text style={styles.statsValue}>{estufas.length}</Text>
                </Text>
              </View>

              <FlatList
                data={estufas}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Nenhuma estufa encontrada.</Text>
                }
                ListHeaderComponent={() => (
                  <View style={styles.listHeader}>
                    <Text style={styles.monthTitle}>Registros</Text>
                    <TouchableOpacity onPress={fetchEstufas}>
                      <Feather name="refresh-cw" size={18} color="#00D2B1" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}

          {/* BOTÃO PARA CADASTRAR NOVA */}
          <TouchableOpacity 
            style={styles.btnNovaEstufa} 
            onPress={() => router.push('/nova-estufa')}
          >
            <Text style={styles.btnText}>Nova Estufa</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 14 },
  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingHorizontal: 20, 
    paddingTop: 20 
  },
  statsSummary: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F0F9F7', 
    paddingVertical: 12, 
    borderRadius: 20, 
    marginBottom: 20 
  },
  statsText: { fontSize: 13, color: '#2A3A56' },
  statsValue: { fontWeight: 'bold', fontSize: 15 },
  statsDivider: { 
    width: 1, 
    height: 15, 
    backgroundColor: 'rgba(42, 58, 86, 0.1)', 
    marginHorizontal: 15 
  },
  listHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15, 
    paddingHorizontal: 5 
  },
  monthTitle: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 22, 
    marginBottom: 12, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: { 
    width: 52, 
    height: 52, 
    borderRadius: 16, 
    backgroundColor: '#F0F9F7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  infoContainer: { flex: 1, marginLeft: 15 },
  estufaNome: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  estufaData: { fontSize: 12, color: '#007AFF', marginTop: 2 },
  statusBadge: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20 },
  statusBaixo: { backgroundColor: '#95C159' },
  statusMedio: { backgroundColor: '#A5A5A5' },
  statusText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  btnNovaEstufa: { 
    position: 'absolute', 
    bottom: 30, 
    alignSelf: 'center', 
    backgroundColor: '#D1FFD7', 
    paddingVertical: 14, 
    paddingHorizontal: 40, 
    borderRadius: 25,
    elevation: 2
  },
  btnText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 }
}); 