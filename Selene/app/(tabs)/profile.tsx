import { View, Text, StyleSheet, Image } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>Andrei Lucas</Text>
      <Text style={styles.role}>Desenvolvedor Full Stack</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', paddingTop: 80 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4CAF50', marginBottom: 20 },
  name: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  role: { color: '#888' }
});