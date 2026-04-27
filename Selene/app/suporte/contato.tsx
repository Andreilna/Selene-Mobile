import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, UIManager } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ContatoScreen() {
  const router = useRouter();

  const social = [
    { name: 'Instagram', icon: 'instagram', color: '#E1306C' },
    { name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
    { name: 'Facebook', icon: 'facebook', color: '#4267B2' },
    { name: 'E-mail', icon: 'envelope', color: '#00D2B1' },
  ];

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
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            <Text style={styles.subTitle}>Como Podemos Ajudar?</Text>

            {/* SELETOR FAQ / NOS CONTATE */}
            <View style={styles.topToggle}>
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => router.push('/suporte')}
              >
                <Text style={styles.toggleText}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]}>
                <Text style={styles.toggleTextActive}>Nos Contate</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE CONTATOS SOCIAIS */}
            <View style={styles.socialList}>
              {social.map((item, index) => (
                <TouchableOpacity key={index} style={styles.socialItem}>
                  <View style={[styles.socialIcon, { backgroundColor: item.color + '20' }]}>
                    <FontAwesome5 name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.socialName}>{item.name}</Text>
                  <Feather name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>
              ))}
            </View>

            {/* BOTÃO FINAL (Jogado para o rodapé do scroll) */}
            <TouchableOpacity 
              style={styles.btnChat} 
              onPress={() => router.push('/suporte/chat')}
            >
              <Text style={styles.btnText}>Suporte ao Produtor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#95C159' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 12 },
  
  content: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  subTitle: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#2A3A56', marginBottom: 20 },
  
  topToggle: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 15, padding: 5, marginBottom: 30 },
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  toggleActive: { backgroundColor: '#00D2B1' },
  toggleTextActive: { color: '#FFF', fontWeight: 'bold' },
  toggleText: { color: '#2A3A56' },

  socialList: { flex: 1 },
  socialItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  socialIcon: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  socialName: { flex: 1, fontSize: 16, color: '#2A3A56', fontWeight: '600' },
  
  btnChat: { 
    backgroundColor: '#00D2B1', 
    height: 55, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    marginBottom: 10 
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});