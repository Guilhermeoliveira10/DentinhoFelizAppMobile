import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, ScrollView, Alert, Platform, Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedSenha = await AsyncStorage.getItem('senha');
      if (savedEmail && savedSenha) {
        setEmail(savedEmail);
        setSenha(savedSenha);
        setRememberMe(true);
      }
    };
    loadSavedData();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha e-mail e senha para acessar.');
      return;
    }

    try {
      const userKey = `user:${email.toLowerCase()}`;
      const stored = await AsyncStorage.getItem(userKey);

      if (!stored) {
        Alert.alert('Erro', 'Usuário não encontrado. Cadastre-se.');
        return;
      }

      const parsed = JSON.parse(stored);
      if (parsed.password !== senha) {
        Alert.alert('Erro', 'Senha incorreta.');
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('senha', senha);
      } else {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('senha');
      }

      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar logar.');
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha e-mail e senha para cadastrar.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'E-mail inválido. Use o formato: exemplo@exemplo.com');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const userKey = `user:${email.toLowerCase()}`;
      const exists = await AsyncStorage.getItem(userKey);

      if (exists) {
        Alert.alert('Aviso', 'Usuário já cadastrado.');
        return;
      }

      await AsyncStorage.setItem(userKey, JSON.stringify({ email, password: senha }));
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao tentar cadastrar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Image source={require('../assets/img_1.png')} style={styles.backIcon} />
        <Image source={require('../assets/img.png')} style={styles.logo} />
        <Text style={styles.title}>Com o e-mail e senha</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Digite seu e-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Digite sua senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={styles.checkbox}>
              {rememberMe && (
                <Image
                  source={require('../assets/ic_check.png')}
                  style={styles.checkmark}
                />
              )}
            </View>
            <Text style={styles.rememberText}>Lembrar minha senha</Text>
          </TouchableOpacity>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCadastro}>
            <Text style={styles.secondaryButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Acessar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Ou acesse com</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <Image source={require('../assets/imggoogle.png')} style={styles.socialIcon} />
          <Image source={require('../assets/imgfacebook.png')} style={styles.socialIcon} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 20,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    padding: 24,
  },
  backIcon: { width: 24, height: 24, marginBottom: 10, tintColor: '#fff' },
  logo: {
    width: 260,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontWeight: 'bold', marginBottom: 6, color: '#ccc' },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 6,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 14 : 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  rememberText: { fontSize: 14, color: '#ccc' },
  forgotText: { fontSize: 14, color: '#ccc' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#e06666',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  secondaryButtonText: { fontWeight: 'bold', color: '#000' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#ccc',
    fontSize: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#555',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
  },
});
