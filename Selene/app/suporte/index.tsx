import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * CONFIGURAÇÃO: LayoutAnimation para Android
 * No Android, as animações de layout precisam ser habilitadas manualmente via UIManager.
 */
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const router = useRouter();
  
  // Estados para controlar qual pergunta está aberta e qual categoria está filtrada
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Geral');

  const categories = ['Geral', 'Sistema', 'Plantio'];

  // Dados mockados para o FAQ (Em produção, viriam da sua API no Render)
  const faqs = [
    { id: '1', question: 'Quais sensores são usados no monitoramento?', answer: 'Os sensores utilizados incluem temperatura, umidade, CO2 e luminosidade, garantindo o controle total do ambiente da sua estufa.' },
    { id: '2', question: 'Como os dados ajudam na produção?', answer: 'Os dados fornecem insights em tempo real para otimizar o crescimento e prevenir doenças através de IA.' },
    { id: '3', question: 'Para que servem os relatórios gerados?', answer: 'Eles servem para histórico de produção e análise de eficiência a longo prazo.' },
    { id: '4', question: 'O que acontece se o sistema falhar?', answer: 'O sistema possui backups locais e enviará um alerta de emergência para o seu dispositivo.' },
    { id: '5', question: 'O sistema funciona em tempo real?', answer: 'Sim, a atualização dos sensores ocorre a cada poucos segundos via protocolo MQTT ou HTTP.' },
  ];

  /**
   * FUNÇÃO: toggleExpand
   * Gerencia a abertura/fechamento dos cards com animação suave.
   */
  const toggleExpand = (id: string) => {
    // Configura a próxima transição de estado para ser animada
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER: Mantém o padrão visual Selene com o fundo Verde Alface */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Central De Ajuda</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>AL</Text></View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ÁREA DE CONTEÚDO: Card branco arredondado */}
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subTitle}>Como Podemos Ajudar?</Text>

            {/* SELETOR: Alterna entre FAQ e tela de Contato/Redes Sociais */}
            <View style={styles.topToggle}>
              <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]}>
                <Text style={styles.toggleTextActive}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => router.push('/suporte/contato')}
              >
                <Text style={styles.toggleText}>Nos Contate</Text>
              </TouchableOpacity>
            </View>

            {/* CATEGORIAS: Filtros rápidos para o usuário encontrar o tema */}
            <View style={styles.categoryRow}>
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* BARRA DE PESQUISA: Estilizada com a borda Turquesa Selene */}
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Pesquisar dúvida..." 
                placeholderTextColor="#A0A0A0" 
                style={styles.searchInput} 
              />
            </View>

            {/* LISTA ACCORDION: Onde as perguntas são renderizadas */}
            <View style={styles.accordionList}>
              {faqs.map((item) => (
                <View key={item.id} style={styles.faqWrapper}>
                  <TouchableOpacity 
                    style={styles.faqHeader} 
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Feather 
                      name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#2A3A56" 
                    />
                  </TouchableOpacity>

                  {/* Renderização Condicional: Só mostra a resposta se o ID for o expandido */}
                  {expandedId === item.id && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                  <View style={styles.divider} />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* BARRA DE NAVEGAÇÃO INFERIOR (Simulada para visualização do fluxo) */}
        <View style={styles.bottomNav}>
             <TouchableOpacity style={styles.navItem}><Feather name="home" size={24} color="#999" /><Text style={styles.navText}>Início</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="archive" size={24} color="#999" /><Text style={styles.navText}>Estufas</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="file-text" size={24} color="#999" /><Text style={styles.navText}>Relatórios</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="settings" size={24} color="#95C159" /><Text style={[styles.navText, {color: '#95C159'}]}>Ajustes</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  
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
    width: 34, 
    height: 34, 
    borderRadius: 17, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 12 },
  
  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50, 
    paddingHorizontal: 25, 
    paddingTop: 20 
  },
  
  subTitle: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#2A3A56', marginBottom: 20 },
  
  topToggle: { flexDirection: 'row', backgroundColor: '#F0F7F0', borderRadius: 15, padding: 5, marginBottom: 15 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleActive: { backgroundColor: '#00D2B1' },
  toggleTextActive: { color: '#FFF', fontWeight: 'bold' },
  toggleText: { color: '#2A3A56' },

  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  catBtn: { 
    flex: 1, 
    backgroundColor: '#F5F5F5', 
    marginHorizontal: 5, 
    paddingVertical: 8, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  catBtnActive: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#95C159' },
  catText: { color: '#2A3A56', fontSize: 12 },
  catTextActive: { fontWeight: 'bold', color: '#4CAF50' },

  searchBar: { 
    backgroundColor: '#F0FFF4', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    height: 48, 
    justifyContent: 'center', 
    marginBottom: 25, 
    borderWidth: 1, 
    borderColor: '#00D2B1' 
  },
  searchInput: { color: '#2A3A56', fontSize: 14 },

  accordionList: { paddingBottom: 20 },
  faqWrapper: { marginBottom: 5 },
  faqHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 15 
  },
  faqQuestion: { flex: 1, fontSize: 14, color: '#2A3A56', fontWeight: '500', lineHeight: 20 },
  faqBody: { paddingBottom: 15, paddingRight: 10 },
  faqAnswer: { color: '#666', fontSize: 13, lineHeight: 19 },
  divider: { height: 1, backgroundColor: '#F0F0F0', width: '100%' },

  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#FFF', 
    paddingVertical: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4, color: '#999' }
});