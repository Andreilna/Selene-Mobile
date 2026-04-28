import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  const router = useRouter();
  
  // ==========================================
  // ESTADOS (STATES) DO USUÁRIO
  // ==========================================
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [iniciais, setIniciais] = useState('US');
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LÓGICA DE CARREGAMENTO (STORAGE/API)
  // ==========================================
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const nomeSalvo = await SecureStore.getItemAsync('userName'); 
        if (nomeSalvo) {
          const partes = nomeSalvo.trim().split(' ');
          const primeiroSegundo = partes.length > 1 
            ? `${partes[0]} ${partes[1]}` 
            : partes[0];
          setNomeUsuario(primeiroSegundo);

          const init = partes.length > 1 
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();
          setIniciais(init);
        }
      } catch (e) {
        console.error("Erro ao carregar dados do SecureStore", e);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosUsuario();
  }, []);

  // ==========================================
  // DADOS MOCKADOS (SERÃO SUBSTITUÍDOS PELA API)
  // ==========================================
  const dadosGerais = {
    totalAnalises: 560,
    totalDeteccoes: 23,
    porcentagem: 30,
  };

  const alertas = [
    { id: 1, tipo: 'risco', gravidade: 'Alta', mensagem: 'Risco elevado detectado', submensagem: 'Possível contaminação por fungo', estufa: 2, tempo: 'há 15 min' },
    { id: 2, tipo: 'umidade', gravidade: 'Média', mensagem: 'Umidade acima do ideal', submensagem: 'Umidade 5% acima do recomendado', estufa: 3, tempo: 'há 1 hora' },
  ];

  // ==========================================
  // FUNÇÕES DE RENDERIZAÇÃO AUXILIARES
  // ==========================================
  const renderCardGeral = (icon: any, label: string, value: string) => (
    <View style={styles.cardGeral}>
      <View style={styles.cardHeaderGeral}>
        <Text style={styles.cardLabelGeral}>{label}</Text>
        {icon}
      </View>
      <Text style={styles.cardValueGeral}>{value}</Text>
      <Text style={styles.cardStatusGeral}>Estável</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* ---------------------------------------------------------
            INÍCIO DO HEADER (ÁREA VERDE)
        ---------------------------------------------------------- */}
        <View style={styles.topContainer}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.topContent}>
            
            {/* SAUDAÇÃO E PERFIL */}
            <View style={styles.header}>
              <View>
                {loading ? (
                  <ActivityIndicator size="small" color="#2A3A56" />
                ) : (
                  <>
                    <Text style={styles.welcomeText}>Olá, {nomeUsuario}</Text>
                    <Text style={styles.subwelcomeText}>Bem-vindo novamente!</Text>
                  </>
                )}
              </View>
              
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

            {/* RESUMO DE NÚMEROS (ANÁLISES E DETECÇÕES) */}
            <View style={styles.resumoContainer}>
              <View style={styles.resumoItem}>
                <View style={styles.resumoHeader}>
                    <Ionicons name="document-text-outline" size={20} color="#2A3A56" />
                    <Text style={styles.resumoLabel}>Total Análises</Text>
                </View>
                <Text style={styles.resumoValue}>{dadosGerais.totalAnalises}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.resumoItem}>
                <View style={styles.resumoHeader}>
                    <Ionicons name="warning-outline" size={20} color="#2A3A56" />
                    <Text style={styles.resumoLabel}>Total Detecções</Text>
                </View>
                <Text style={[styles.resumoValue, { color: '#2A3A56' }]}>{dadosGerais.totalDeteccoes}</Text>
              </View>
            </View>

            {/* BARRA DE PROGRESSO DE SAÚDE */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${dadosGerais.porcentagem}%` }]}>
                    <Text style={styles.progressText}>{dadosGerais.porcentagem}%</Text>
                </View>
                <Text style={styles.progressValueText}>{dadosGerais.totalAnalises}</Text>
            </View>
            
            <View style={styles.progressDescriptionRow}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#2A3A56" />
                <Text style={styles.progressDescriptionText}>{dadosGerais.porcentagem}% De Detecções</Text>
            </View>
          </SafeAreaView>
        </View>
        {/* ---------------------------------------------------------
            FIM DO HEADER (ÁREA VERDE)
        ---------------------------------------------------------- */}


        {/* ---------------------------------------------------------
            INÍCIO DO CONTEÚDO (ÁREA BRANCA)
        ---------------------------------------------------------- */}
        <View style={styles.bottomContainer}>
          
          {/* SEÇÃO: VISÃO GERAL (CARDS PEQUENOS) */}
          <View style={styles.sectionHeaderGeral}>
            <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#2A3A56" />
            <Text style={styles.sectionTitle}>Visão Geral</Text>
          </View>

          <View style={styles.cardsGeralContainer}>
            {renderCardGeral(<MaterialCommunityIcons name="thermometer" size={16} color="#2A3A56" />, 'Temp.', '21° C')}
            {renderCardGeral(<MaterialCommunityIcons name="water-percent" size={16} color="#2A3A56" />, 'Umid.', '15%')}
            {renderCardGeral(<Ionicons name="partly-sunny" size={16} color="#2A3A56" />, 'Luz', '20H')}
            {renderCardGeral(<MaterialCommunityIcons name="cloud" size={16} color="#2A3A56" />, 'CO2', '100')}
          </View>

          {/* SEÇÃO: ALERTAS RECENTES */}
          <View style={[styles.sectionHeaderGeral, { marginBottom: 15 }]}>
            <Ionicons name="warning-outline" size={24} color="#2A3A56" />
            <Text style={styles.sectionTitle}>Alertas ({alertas.length})</Text>
          </View>

          {alertas.map(alerta => (
            <TouchableOpacity 
              key={alerta.id} 
              activeOpacity={0.8}
              onPress={() => router.push(`/detalhes/${alerta.estufa}`)}
            >
              <View style={styles.cardAlerta}>
                  <View style={styles.cardAlertaMain}>
                      <View style={styles.cardAlertaContentRow}>
                          <View style={styles.alertaIconContainer}>
                              <Ionicons 
                                  name={alerta.tipo === 'risco' ? "close-circle-outline" : "warning-outline"} 
                                  size={28} 
                                  color={alerta.gravidade === 'Alta' ? '#EF4444' : '#F59E0B'} 
                              />
                          </View>
                          <View style={styles.alertaTextContainer}>
                              <Text style={styles.alertaTitle}>{alerta.mensagem}</Text>
                              <Text style={styles.alertaSubtitle}>{alerta.submensagem}</Text>
                          </View>
                      </View>
                      <View style={[styles.badgeGravidade, { backgroundColor: alerta.gravidade === 'Alta' ? '#EF4444' : '#F59E0B' }]}>
                          <Text style={styles.badgeText}>{alerta.gravidade}</Text>
                      </View>
                  </View>
                  <View style={styles.alertaFooter}>
                      <Text style={styles.alertaFooterText}>Estufa {alerta.estufa}</Text>
                      <Text style={styles.alertaFooterText}>{alerta.tempo}</Text>
                  </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* ---------------------------------------------------------
            FIM DO CONTEÚDO (ÁREA BRANCA)
        ---------------------------------------------------------- */}

        {/* ESPAÇAMENTO FINAL PARA O SCROLL NÃO CORTAR O CONTEÚDO */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  // Estilos globais
  mainContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { flexGrow: 1 },
  
  // Estilos do Topo (Verde)
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
  
  // Estilos do Conteúdo (Branco)
  bottomContainer: { paddingHorizontal: 20, paddingTop: 30 },
  sectionHeaderGeral: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  
  // Estilos dos Cards de Visão Geral
  cardsGeralContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  cardGeral: { backgroundColor: '#FFF', borderRadius: 15, width: '23%', paddingVertical: 15, paddingHorizontal: 5, alignItems: 'center', elevation: 3 },
  cardHeaderGeral: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10 },
  cardLabelGeral: { fontSize: 9, color: '#2A3A56', fontWeight: 'bold' },
  cardValueGeral: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginBottom: 5 },
  cardStatusGeral: { fontSize: 10, color: '#95C159', fontWeight: 'bold' },
  
  // Estilos dos Cards de Alerta
  cardAlerta: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
  cardAlertaMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  cardAlertaContentRow: { flexDirection: 'row', gap: 12, flex: 1 },
  alertaIconContainer: { width: 30, justifyContent: 'center' },
  alertaTextContainer: { flex: 1 },
  alertaTitle: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  alertaSubtitle: { fontSize: 13, color: '#2A3A56', opacity: 0.8 },
  badgeGravidade: { borderRadius: 15, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: '#FFF' },
  alertaFooter: { flexDirection: 'row', gap: 20, marginLeft: 42, opacity: 0.6 },
  alertaFooterText: { fontSize: 12, color: '#2A3A56' },
});