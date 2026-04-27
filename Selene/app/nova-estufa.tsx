import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CadastroEstufa() {
  const router = useRouter();
  
  // States para o formulário
  const [data, setData] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [camera, setCamera] = useState('');
  const [obs, setObs] = useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Nova Estufa</Text>
          
          <View style={styles.headerIcons}>
            <View style={styles.profileCircle}><Text style={styles.profileText}>LB</Text></View>
            <Feather name="bell" size={24} color="white" style={{ marginLeft: 12 }} />
          </View>
        </View>

        {/* FORMULÁRIO (CONTEÚDO BRANCO) */}
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {/* Campo Data */}
            <Text style={styles.label}>Data Criação</Text>
            <View style={styles.inputRow}>
              <TextInput 
                style={styles.input} 
                value={data} 
                onChangeText={setData} 
                placeholder="00/00/0000"
              />
              <TouchableOpacity style={styles.calendarIcon}>
                <Feather name="calendar" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Campo Nome */}
            <Text style={styles.label}>Nome</Text>
            <TextInput 
              style={styles.input} 
              value={nome} 
              onChangeText={setNome}
            />

            {/* Campo Quantidade */}
            <Text style={styles.label}>Quantidade Compostos</Text>
            <TextInput 
              style={styles.input} 
              value={quantidade} 
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />

            {/* Campo Endereço Câmera */}
            <Text style={styles.label}>Endereço Câmera</Text>
            <TextInput 
              style={styles.input} 
              value={camera} 
              onChangeText={setCamera}
            />

            {/* Campo Observações */}
            <Text style={[styles.label, { color: '#00D2B1' }]}>Observações</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={obs} 
              onChangeText={setObs}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            {/* Botão Salvar */}
            <TouchableOpacity style={styles.btnSalvar}>
              <Text style={styles.btnSalvarText}>Salvar</Text>
            </TouchableOpacity>

          </ScrollView>
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
    paddingVertical: 20 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2A3A56' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#2A3A56', fontWeight: 'bold', fontSize: 13 },

  content: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50, 
    paddingHorizontal: 35,
    paddingTop: 40
  },
  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2A3A56', 
    marginBottom: 8, 
    marginLeft: 5 
  },
  input: { 
    backgroundColor: '#E1F5E5', // Verde clarinho dos inputs
    borderRadius: 20, 
    height: 45, 
    paddingHorizontal: 20, 
    marginBottom: 20,
    color: '#2A3A56'
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  // Ajuste para o input com ícone de calendário
  inputRowField: { flex: 1 }, 
  calendarIcon: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: '#00D2B1',
    borderRadius: 8,
    padding: 4
  },
  textArea: { 
    height: 150, 
    paddingTop: 15, 
    borderRadius: 25 
  },
  btnSalvar: { 
    backgroundColor: '#95C159', 
    height: 55, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    // Sombra
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  btnSalvarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});