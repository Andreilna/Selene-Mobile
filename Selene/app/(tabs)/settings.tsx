import { View, Text, StyleSheet, Switch } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Notificações</Text>
        <Switch value={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Modo Escuro</Text>
        <Switch value={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#333' },
  label: { color: '#fff', fontSize: 16 }
});