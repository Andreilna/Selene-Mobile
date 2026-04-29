import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Interface para tipar os produtores da lista
interface Produtor {
  id: string;
  nome: string;
  data: string;
  cargo: string;
  codigo: string;
}

export default function ControleAcessoScreen() {
  const router = useRouter();
  const [filterActive, setFilterActive] = useState('Dia');

  // Dados mockados conforme a imagem
  const produtores: Produtor[] = [
    { id: '1', nome: 'Jorge Lima', data: 'Abril 30 - 14:40', cargo: 'Produtor', codigo: '3457651' },
    { id: '2', nome: 'Yago Pereira', data: 'Abril 30 - 14:45', cargo: 'Produtor', codigo: '2312456' },
    { id: '3', nome: 'Marco Andrei', data: 'Abril 30 - 14:50', cargo: 'Produtor', codigo: '2134565' },
    { id: '4', nome: 'Carla Diaz', data: 'Abril 30 - 14:55', cargo: 'Produtor', codigo: '2134554' },
  ];

  const timeFilters = ['Dia', 'Semana', 'Mês', 'Ano'];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER: Título e Perfil */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Controle Acessos</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <TouchableOpacity style={styles.bellBtn}>
              <Feather name="bell" size={24} color="#2A3A56" />
            </TouchableOpacity>
          </View>
        </View>

        {/* DASHBOARD: Estatísticas Rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStatCard}>
            <Text style={styles.statLabelLink}>Usuários Cadastrados</Text>
            <Text style={styles.statValueBig}>45</Text>
          </View>

          <View style={styles.secondaryStatsRow}>
            <View style={styles.subStat}>
              <View style={styles.subStatLabelRow}>
                <Feather name="external-link" size={14} color="#2A3A56" />
                <Text style={styles.subStatLabel}>Online Atualmente</Text>
              </View>
              <Text style={styles.subStatValue}>12</Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.subStat}>
              <View style={styles.subStatLabelRow}>
                <Feather name="corner-right-down" size={14} color="#2A3A56" />
                <Text style={styles.subStatLabel}>Pendente Validação</Text>
              </View>
              <Text style={[styles.subStatValue, { color: '#2D9CDB' }]}>3</Text>
            </View>
          </View>
        </View>

        {/* CONTEÚDO BRANCO ARREDONDADO */}
        <View style={styles.content}>
          
          {/* FILTRO DE TEMPO (Pílula) */}
          <View style={styles.timeFilterContainer}>
            {timeFilters.map((item) => (
              <TouchableOpacity 
                key={item} 
                style={[styles.timeBtn, filterActive === item && styles.timeBtnActive]}
                onPress={() => setFilterActive(item)}
              >
                <Text style={[styles.timeBtnText, filterActive === item && styles.timeBtnTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* TÍTULO DA SEÇÃO E FILTRO */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtores Cadastrados</Text>
            <TouchableOpacity style={styles.filterIconBtn}>
              <MaterialIcons name="filter-list" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* LISTA DE PRODUTORES */}
          <FlatList
            data={produtores}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userIconContainer}>
                  <Feather name="user" size={24} color="#FFF" />
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.nome}</Text>
                  <Text style={styles.userData}>{item.data}</Text>
                </View>

                <View style={styles.roleContainer}>
                  <View style={styles.verticalLine} />
                  <Text style={styles.roleText}>{item.cargo}</Text>
                  <View style={styles.verticalLine} />
                </View>

                <Text style={styles.userCode}>{item.codigo}</Text>
              </View>
            )}
          />

          {/* BOTÃO NOVO CADASTRO (Fixo no rodapé do content) */}
          <TouchableOpacity style={styles.btnNewUser} 
            onPress={() => router.push("/admin/novo-usuario")}
          >
            <Text style={styles.btnNewUserText}>Novo Cadastro</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingVertical: 15 
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },
  bellBtn: { marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.5)', padding: 5, borderRadius: 15 },

  // Dashboard Stats
  statsContainer: { paddingHorizontal: 25, marginBottom: 25 },
  mainStatCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 15, 
    alignItems: 'center',
    elevation: 3
  },
  statLabelLink: { color: '#2A3A56', textDecorationLine: 'underline', fontWeight: 'bold', marginBottom: 5 },
  statValueBig: { fontSize: 32, fontWeight: 'bold', color: '#2A3A56' },
  
  secondaryStatsRow: { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  subStat: { flex: 1, alignItems: 'center' },
  subStatLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  subStatLabel: { fontSize: 12, color: '#2A3A56', marginLeft: 5 },
  subStatValue: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  verticalDivider: { width: 1, height: 40, backgroundColor: '#FFF', opacity: 0.5 },

  // Content Area
  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 60, 
    borderTopRightRadius: 60, 
    paddingHorizontal: 25, 
    paddingTop: 30 
  },

  // Time Filter
  timeFilterContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F0F5F0', 
    borderRadius: 20, 
    padding: 5, 
    marginBottom: 25 
  },
  timeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 15 },
  timeBtnActive: { backgroundColor: '#00D2B1' },
  timeBtnText: { color: '#2A3A56', fontSize: 13 },
  timeBtnTextActive: { color: '#FFF', fontWeight: 'bold' },

  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  filterIconBtn: { backgroundColor: '#00D2B1', padding: 6, borderRadius: 10 },

  // User Card
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  userIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#00D2B1', justifyContent: 'center', alignItems: 'center' },
  userInfo: { flex: 2, marginLeft: 12 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#2A3A56' },
  userData: { fontSize: 11, color: '#2D9CDB' },
  
  roleContainer: { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  verticalLine: { width: 1, height: 30, backgroundColor: '#00D2B1', marginHorizontal: 8 },
  roleText: { fontSize: 11, color: '#666' },
  
  userCode: { flex: 1.5, fontSize: 14, fontWeight: 'bold', color: '#2D9CDB', textAlign: 'right' },

  // Bottom Button
  btnNewUser: { 
    backgroundColor: '#00D2B1', 
    height: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
    elevation: 5
  },
  btnNewUserText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});