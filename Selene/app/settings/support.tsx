import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Ionicons, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SupportScreen() {
  const router = useRouter();

  const supportOptions = [
    { id: '1', title: 'Chat via WhatsApp', subtitle: 'Resposta em até 15 min', icon: 'whatsapp', color: '#25D366' },
    { id: '2', title: 'E-mail de Suporte', subtitle: 'ajuda@greenrise.com', icon: 'email-outline', color: '#00D1A0' },
    { id: '3', title: 'Central de Ajuda (FAQ)', subtitle: 'Dúvidas sobre as estufas', icon: 'frequently-asked-questions', color: '#95C159' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2A3A56" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suporte</Text>
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>LB</Text></View>
            <Octicons name="bell" size={24} color="#F5F5F5" />
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.introBox}>
          <MaterialCommunityIcons name="face-agent" size={40} color="#00D1A0" />
          <Text style={styles.introTitle}>Como podemos ajudar?</Text>
          <Text style={styles.introSub}>Nossa equipe está pronta para monitorar seus problemas.</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {supportOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionItem}>
              <View style={[styles.iconBox, { backgroundColor: option.color }]}>
                <MaterialCommunityIcons name={option.icon as any} size={24} color="#FFF" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSub}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          ))}

          <View style={styles.statusBox}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Todos os sistemas operacionais: 100%</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  topSection: { 
    backgroundColor: '#95C159', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    paddingBottom: 60, 
    paddingHorizontal: 25 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 10, fontWeight: 'bold', color: '#2A3A56' },
  contentCard: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    marginTop: -30, 
    marginHorizontal: 20, 
    borderRadius: 30, 
    padding: 20, 
    elevation: 4 
  },
  introBox: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: '#2A3A56', marginTop: 10 },
  introSub: { fontSize: 13, color: '#8E8E8E', textAlign: 'center', marginTop: 5 },
  optionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F9F9', 
    padding: 15, 
    borderRadius: 20, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  optionTextContainer: { flex: 1, marginLeft: 15 },
  optionTitle: { fontSize: 15, fontWeight: 'bold', color: '#2A3A56' },
  optionSub: { fontSize: 12, color: '#8E8E8E' },
  statusBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 20,
    backgroundColor: '#EDFCED',
    padding: 10,
    borderRadius: 15
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00D1A0', marginRight: 8 },
  statusText: { fontSize: 12, color: '#2A3A56', fontWeight: '500' }
});