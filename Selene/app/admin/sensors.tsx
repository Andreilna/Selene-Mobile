import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function AdminSensors() {
  const [estufa, setEstufa] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [tipo, setTipo] = useState('Temperatura');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Número/Nome da Estufa</Text>
        <TextInput style={styles.input} value={estufa} onChangeText={setEstufa} placeholder="Ex: Estufa 02" />

        <Text style={styles.label}>ID do Sensor (Hardware)</Text>
        <TextInput style={styles.input} value={sensorId} onChangeText={setSensorId} placeholder="Ex: SN-9920-X" />

        <Text style={styles.label}>Tipo de Monitoramento</Text>
        <View style={styles.grid}>
          {['Temperatura', 'Umidade', 'CO2', 'Luz'].map((item) => (
            <TouchableOpacity 
              key={item}
              style={[styles.typeButton, tipo === item && styles.typeButtonActive]}
              onPress={() => setTipo(item)}
            >
              <Text style={tipo === item ? styles.typeTextActive : styles.typeText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Sensor Ativado!")}>
          <Text style={styles.buttonText}>Vincular Sensor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, elevation: 4 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#2A3A56', marginBottom: 8 },
  input: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 15, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  typeButton: { width: '47%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#95C159', alignItems: 'center' },
  typeButtonActive: { backgroundColor: '#95C159' },
  typeText: { color: '#2A3A56', fontSize: 12, fontWeight: 'bold' },
  typeTextActive: { color: '#2A3A56', fontSize: 12, fontWeight: 'bold' },
  button: { backgroundColor: '#2A3A56', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});