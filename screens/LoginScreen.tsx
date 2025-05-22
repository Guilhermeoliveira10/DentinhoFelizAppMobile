import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadRemembered = async () => {
      const savedEmail = await AsyncStorage.getItem('remember:email');
      const savedSenha = await AsyncStorage.getItem('remember:senha');
      if (savedEmail && savedSenha) {
        setEmail(savedEmail);
        setSenha(savedSenha);
        setRememberMe(true);
      }
    };
    loadRemembered();
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const key = `user:${email.trim().toLowerCase()}`;
    const storedUser = await AsyncStorage.getItem(key);

    if (!storedUser) {
      Alert.alert('Erro', 'Usuário não encontrado.');
      return;
    }

    const { senha: senhaSalva } = JSON.parse(storedUser);

    if (senha !== senhaSalva) {
      Alert.alert('Erro', 'Senha incorreta.');
      return;
    }

    await AsyncStorage.setItem('email', email); // Armazena o email logado

    if (rememberMe) {
      await AsyncStorage.setItem('remember:email', email);
      await AsyncStorage.setItem('remember:senha', senha);
    } else {
      await AsyncStorage.removeItem('remember:email');
      await AsyncStorage.removeItem('remember:senha');
    }

    navigation.navigate('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={styles.checkbox}>
            {rememberMe && (
              <Image
                source={require('../assets/ic_check.png')}
                style={styles.checkIcon}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Lembrar minha senha</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <FontAwesome name="user-plus" size={16} color="#000" style={styles.icon} />
            <Text style={styles.secondaryButtonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <FontAwesome name="sign-in" size={16} color="#fff" style={styles.icon} />
            <Text style={styles.primaryButtonText}>Acessar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#121212',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 4,
  },
  checkIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  checkboxLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#e06666',
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});
