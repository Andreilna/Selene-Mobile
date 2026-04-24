import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para ler o nome salvo no Login

export default function HomeScreen() {
  const [nomeUsuario, setNomeUsuario] = useState('Usuário');
  const [iniciais, setIniciais] = useState('US');
  const [loading, setLoading] = useState(true);

  // Lógica para buscar o nome e formatar
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        // Tenta pegar o nome salvo no AsyncStorage (ou você pode fazer um axios.get aqui)
        const nomeSalvo = await AsyncStorage.getItem('@user_name'); 
        
        if (nomeSalvo) {
          const partes = nomeSalvo.trim().split(' ');
          // Pega o primeiro e o segundo nome (se existir)
          const primeiroSegundo = partes.length > 1 
            ? `${partes[0]} ${partes[1]}` 
            : partes[0];
          
          setNomeUsuario(primeiroSegundo);

          // Gera iniciais (Ex: Andrei Lucas -> AL)
          const init = partes.length > 1 
            ? (partes[0][0] + partes[1][0]).toUpperCase()
            : partes[0][0].toUpperCase();
          setIniciais(init);
        }
      } catch (e) {
        console.error("Erro ao carregar nome", e);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosUsuario();
  }, []);

  const dadosGerais = {
    totalAnalises: 560,
    totalDeteccoes: 23,
    porcentagem: 30,
  };

  const alertas = [
    { id: 1, tipo: 'risco', gravidade: 'Alta', mensagem: 'Risco elevado detectado', submensagem: 'Possível contaminação por fungo', estufa: 2, tempo: 'há 15 min' },
    { id: 2, tipo: 'umidade', gravidade: 'Média', mensagem: 'Umidade acima do ideal', submensagem: 'Umidade 5% acima do recomendado', estufa: 3, tempo: 'há 1 hora' },
  ];

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
      
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.topContainer}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.topContent}>
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
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{iniciais}</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                  <Octicons name="bell" size={24} color="#F5F5F5" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Restante do seu código (Resumo, Progress Bar, etc...) */}
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

        {/* Visão Geral, Alertas e Gráfico permanecem iguais... */}
        <View style={styles.bottomContainer}>
          <View style={styles.sectionHeaderGeral}>
            <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#2A3A56" />
            <Text style={styles.sectionTitle}>Visão Geral</Text>
          </View>

          <View style={styles.cardsGeralContainer}>
            {renderCardGeral(<MaterialCommunityIcons name="thermometer" size={16} color="#2A3A56" />, 'Temperatura', '21° C')}
            {renderCardGeral(<MaterialCommunityIcons name="water-percent" size={16} color="#2A3A56" />, 'Umidade', '15%')}
            {renderCardGeral(<Ionicons name="partly-sunny" size={16} color="#2A3A56" />, 'Luz', '20H')}
            {renderCardGeral(<MaterialCommunityIcons name="cloud" size={16} color="#2A3A56" />, 'CO2', '100')}
          </View>

          {/* ... restante do código original ... */}
          <View style={[styles.sectionHeaderGeral, { marginBottom: 15 }]}>
            <Ionicons name="warning-outline" size={24} color="#2A3A56" />
            <Text style={styles.sectionTitle}>Alertas({alertas.length})</Text>
          </View>

          {alertas.map(alerta => (
            <View key={alerta.id} style={styles.cardAlerta}>
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
          ))}
          
          <View style={[styles.sectionHeaderGeral, { marginBottom: 15, marginTop: 25 }]}>
            <MaterialCommunityIcons name="chart-areaspline" size={24} color="#2A3A56" />
            <Text style={styles.sectionTitle}>Desempenho Geral</Text>
          </View>

          <View style={styles.desempenhoHeaderRow}>
            <Text style={styles.desempenhoTitle}>Relatório Monitoramento</Text>
            <View style={styles.desempenhoIcons}>
              <TouchableOpacity style={styles.iconButtonDesempenho}><Ionicons name="search-outline" size={20} color="#2A3A56" /></TouchableOpacity>
              <TouchableOpacity style={styles.iconButtonDesempenho}><Ionicons name="calendar-outline" size={20} color="#2A3A56" /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.graficoContainer}>
            <View style={styles.graficoContentRow}>
              <View style={styles.graficoEscalaLateral}>
                <Text style={styles.graficoPercentText}>15%</Text>
                <Text style={styles.graficoPercentText}>10%</Text>
                <Text style={styles.graficoPercentText}>5%</Text>
                <Text style={styles.graficoPercentText}>1%</Text>
              </View>
              <View style={styles.graficoPlaceholder}>
                <Image
                  source={require('../../assets/images/grafico_placeholder.svg')}
                  style={styles.logoGrafico}
                  contentFit="contain"
                />
              </View>
            </View>
            <View style={styles.graficoDaysRow}>
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(dia => (
                <Text key={dia} style={styles.graficoDayText}>{dia}</Text>
              ))}
            </View>
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ... Styles permanecem os mesmos ...
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { flexGrow: 1 },
  topContainer: {
    backgroundColor: '#95C159',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  topContent: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 35, marginTop: 15 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#2A3A56' },
  subwelcomeText: { fontSize: 14, color: '#2A3A56', opacity: 0.8 },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatarCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#2A3A56' },
  iconButton: { padding: 5 },
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
  bottomContainer: { paddingHorizontal: 20, paddingTop: 30 },
  sectionHeaderGeral: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  cardsGeralContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  cardGeral: { backgroundColor: '#FFF', borderRadius: 15, width: '23%', paddingVertical: 15, paddingHorizontal: 5, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeaderGeral: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 10 },
  cardLabelGeral: { fontSize: 9, color: '#2A3A56', fontWeight: 'bold' },
  cardValueGeral: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginBottom: 5 },
  cardStatusGeral: { fontSize: 10, color: '#95C159', fontWeight: 'bold' },
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
  desempenhoHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  desempenhoTitle: { fontSize: 16, color: '#2A3A56', fontWeight: 'bold' },
  desempenhoIcons: { flexDirection: 'row', gap: 15 },
  iconButtonDesempenho: { backgroundColor: '#EDFCED', width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  graficoContainer: { backgroundColor: '#EDFCED', borderRadius: 20, padding: 15, minHeight: 220 },
  graficoContentRow: { flexDirection: 'row', marginBottom: 10 },
  graficoEscalaLateral: { justifyContent: 'space-between', alignItems: 'flex-end', width: 35, paddingRight: 8, paddingVertical: 10 },
  graficoPercentText: { color: '#2A3A56', fontSize: 11, fontWeight: 'bold', opacity: 0.5 },
  graficoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoGrafico: { width: '100%', height: 140 },
  graficoDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginLeft: 35 },
  graficoDayText: { fontSize: 12, fontWeight: 'bold', color: '#2A3A56' }
});