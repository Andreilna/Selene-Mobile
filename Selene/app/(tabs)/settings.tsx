import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function SettingsMenu() {
  const router = useRouter();

  // ==========================================
  // DEFINIÇÃO DOS ITENS DO MENU (MAP)
  // ==========================================
  const menuItems = [
    { id: '1', label: 'Configurações Notificação', icon: 'notifications-outline', route: '/settings/notifications' },
    { id: '2', label: 'Configurações Senha', icon: 'key-outline', route: '/settings/password' },
    { id: '3', label: 'Suporte', icon: 'help-circle-outline', route: '/suporte' }, 
    { id: '4', label: 'Deletar Conta', icon: 'person-remove-outline', route: '/settings/delete-account' },
  ];

  return (
    <View style={styles.container}>
      
      {/* ---------------------------------------------------------
          INÍCIO DO HEADER (ÁREA VERDE)
      ---------------------------------------------------------- */}
      <View style={styles.topSection}>
        <SafeAreaView edges={['top']} style={styles.header}>
          <Text style={styles.headerTitle}>Configurações</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>LB</Text>
            </View>
            
            <TouchableOpacity onPress={() => router.push('/alertas')}>
              <Feather name="bell" size={24} color="#2A3A56" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {/* ---------------------------------------------------------
          FIM DO HEADER
      ---------------------------------------------------------- */}


      {/* ---------------------------------------------------------
          LISTA DE OPÇÕES (MENU)
      ---------------------------------------------------------- */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem} 
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              {/* ÍCONE DENTRO DO CÍRCULO */}
              <View style={styles.iconBox}>
                <Ionicons name={item.icon as any} size={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{item.label}</Text>
            </View>

            {/* SETA PARA A DIREITA (CHEVRON) */}
            <Ionicons name="chevron-forward" size={20} color="#2A3A56" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* ---------------------------------------------------------
          FIM DA LISTA
      ---------------------------------------------------------- */}

    </View>
  );
}

// ==========================================
// ESTILIZAÇÃO (STYLES)
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  // Header com curvatura inferior
  topSection: { 
    backgroundColor: '#95C159', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    paddingBottom: 70, 
    paddingHorizontal: 25 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { 
    width: 35, height: 35, borderRadius: 17.5, 
    backgroundColor: '#EDFCED', justifyContent: 'center', alignItems: 'center' 
  },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: '#2A3A56' },

  // Container da Lista (Sobe um pouco para sobrepor o header verde)
  menuContainer: { flex: 1, paddingHorizontal: 25, marginTop: -35 },
  
  // Itens Individuais do Menu
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 12, 
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { 
    width: 36, height: 36, borderRadius: 18, 
    backgroundColor: '#00D1A0', justifyContent: 'center', alignItems: 'center', 
    marginRight: 15 
  },
  menuText: { fontSize: 15, color: '#2A3A56', fontWeight: '600' },
});