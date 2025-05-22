import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ScrollView, Dimensions, Platform, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Insira um email válido no formato exemplo@dominio.com');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      await AsyncStorage.setItem('email', email); // Salva email logado
      await AsyncStorage.setItem(`user:${email}`, JSON.stringify({ email, senha, username }));
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar os dados');
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Crie sua conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
              style={styles.input}
              placeholder="exemplo@dominio.com"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de usuário:</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome de usuário"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirme sua senha:</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme a senha"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmSenha}
              onChangeText={setConfirmSenha}
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <FontAwesome name="user-plus" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginRedirectText}>
              Já tem cadastro? <Text style={styles.loginRedirectLink}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    flexDirection: 'row',
    backgroundColor: '#e06666',
    borderRadius: 8,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 4,
  },
  loginRedirectText: {
    color: '#ccc',
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  loginRedirectLink: {
    color: '#e06666',
    fontWeight: 'bold',
  },
});
