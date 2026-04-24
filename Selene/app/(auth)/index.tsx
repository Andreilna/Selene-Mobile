import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Platform,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image'; 
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Feather, FontAwesome5 } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://selene-mobile.onrender.com/api/v1/auth/login', { 
        email: email.trim().toLowerCase(), 
        senha: password 
      });

      if (response.data.success) {
        // EXTRAÇÃO DOS DADOS REAIS DO BANCO
        const { token, usuario } = response.data.data;
        const nomeCompleto = usuario.nome_completo;
        const emailUsuario = usuario.email;
        const userId = usuario._id;

        // SALVANDO NO "ARMÁRIO" SEGURO PARA USO NAS OUTRAS TELAS
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userName', nomeCompleto);
        await SecureStore.setItemAsync('userEmail', emailUsuario);
        await SecureStore.setItemAsync('userId', userId);

        router.replace('/(tabs)/home'); 
      }
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "E-mail ou senha inválidos.";
      Alert.alert("Erro", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Parte Superior - Logo */}
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_selene_login.svg')}
            style={styles.logo}
            contentFit="contain"
            transition={200}
          />
        </View>

        {/* Parte Inferior - Formulário Verde */}
        <View style={styles.bottomContainer}>
          
          <Text style={styles.label}>Email:</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="example@example.com" 
              placeholderTextColor="#A0A0A0" 
              value={email} 
              // FORÇA MINÚSCULO ENQUANTO DIGITA
              onChangeText={(text) => setEmail(text.toLowerCase())}
              autoCapitalize="none" // IMPEDE A PRIMEIRA LETRA MAIÚSCULA
              keyboardType="email-address"
              autoCorrect={false}
            />
          </View>
          
          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor="#A0A0A0" 
              secureTextEntry={!showPassword} 
              value={password} 
              autoCapitalize="none"
              onChangeText={setPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#2A3A56" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot')}>
            <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Acessar com:</Text>
            <View style={styles.socialIconsRow}> 
              <TouchableOpacity style={styles.socialIconButton}>
                <FontAwesome5 name="facebook-f" size={20} color="#2A3A56" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconButton}>
                <FontAwesome5 name="google" size={20} color="#2A3A56" />
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  topContainer: {
    flex: 0.4, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    minHeight: 200, 
  },
  logo: {
    width: 250,
    height: 100,
  },
  bottomContainer: {
    flex: 1, 
    backgroundColor: '#95C159', 
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40, 
  },
  label: {
    color: '#2A3A56', 
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  button: { 
    backgroundColor: '#2A3A56', 
    height: 55,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  forgotPassword: {
    color: '#2A3A56',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 40,
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 'auto', 
  },
  socialText: {
    color: '#2A3A56',
    fontSize: 14,
    marginBottom: 15,
  },
  socialIconsRow: {
    flexDirection: 'row',
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#2A3A56',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  }
});