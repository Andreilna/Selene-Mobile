import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Ativa animação no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Geral');

  const categories = ['Geral', 'Sistema', 'Plantio'];

  const faqs = [
    { id: '1', question: 'Quais sensores são usados no monitoramento?', answer: 'Os sensores utilizados incluem temperatura, umidade, CO2 e luminosidade, garantindo o controle total do ambiente da sua estufa.' },
    { id: '2', question: 'Como os dados ajudam na produção?', answer: 'Os dados fornecem insights em tempo real para otimizar o crescimento e prevenir doenças.' },
    { id: '3', question: 'Para que servem os relatórios gerados?', answer: 'Eles servem para histórico de produção e análise de eficiência a longo prazo.' },
    { id: '4', question: 'O que acontece se o sistema falhar?', answer: 'O sistema possui backups locais e enviará um alerta de emergência para o seu dispositivo.' },
    { id: '5', question: 'O sistema funciona em tempo real?', answer: 'Sim, a atualização dos sensores ocorre a cada poucos segundos.' },
  ];

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER PADRÃO SELENE */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={26} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Central De Ajuda</Text>
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subTitle}>Como Podemos Ajudar?</Text>

            {/* SELETOR FAQ / NOS CONTATE */}
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

            {/* CATEGORIAS (Geral, Sistema, Plantio) */}
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

            {/* BARRA DE PESQUISA VERDE ÁGUA */}
            <View style={styles.searchBar}>
              <TextInput placeholder="Pesquisar" placeholderTextColor="#2A3A56" style={styles.searchInput} />
            </View>

            {/* LISTA ACCORDION */}
            <View style={styles.accordionList}>
              {faqs.map((item) => (
                <View key={item.id} style={styles.faqWrapper}>
                  <TouchableOpacity 
                    style={styles.faqHeader} 
                    onPress={() => toggleExpand(item.id)}
                  >
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Feather 
                      name={expandedId === item.id ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color="#2A3A56" 
                    />
                  </TouchableOpacity>
                  {expandedId === item.id && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* BOTTOM NAV (Simulada para fechar o visual) */}
        <View style={styles.bottomNav}>
             <TouchableOpacity style={styles.navItem}><Feather name="home" size={24} color="#999" /><Text style={styles.navText}>Início</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="archive" size={24} color="#999" /><Text style={styles.navText}>Estufas</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="file-text" size={24} color="#999" /><Text style={styles.navText}>Relatórios</Text></TouchableOpacity>
             <TouchableOpacity style={styles.navItem}><Feather name="settings" size={24} color="#95C159" /><Text style={[styles.navText, {color: '#95C159'}]}>Configurações</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold' },
  
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 50, borderTopRightRadius: 50, paddingHorizontal: 25, paddingTop: 20 },
  subTitle: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#2A3A56', marginBottom: 20 },
  
  topToggle: { flexDirection: 'row', backgroundColor: '#E8F5E9', borderRadius: 15, padding: 5, marginBottom: 15 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleActive: { backgroundColor: '#00D2B1' },
  toggleTextActive: { color: '#FFF', fontWeight: 'bold' },
  toggleText: { color: '#2A3A56' },

  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  catBtn: { flex: 1, backgroundColor: '#E8F5E9', marginHorizontal: 5, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  catBtnActive: { backgroundColor: '#C8E6C9' },
  catText: { color: '#2A3A56', fontSize: 13 },
  catTextActive: { fontWeight: 'bold' },

  searchBar: { backgroundColor: '#E0F2F1', borderRadius: 10, paddingHorizontal: 15, height: 45, justifyContent: 'center', marginBottom: 25, borderWidth: 1, borderColor: '#00D2B1' },
  searchInput: { color: '#2A3A56' },

  accordionList: { paddingBottom: 20 },
  faqWrapper: { marginBottom: 15 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  faqQuestion: { flex: 1, fontSize: 14, color: '#2A3A56', lineHeight: 20 },
  faqBody: { paddingTop: 10, paddingBottom: 5 },
  faqAnswer: { color: '#666', fontSize: 13, lineHeight: 18 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#F8F8F8', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4, color: '#999' }
});