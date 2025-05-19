import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      if (!savedEmail) return;

      setEmail(savedEmail);
      const userData = await AsyncStorage.getItem(`user:${savedEmail}`);
      const imageUri = await AsyncStorage.getItem(`user:${savedEmail}:image`);
      if (userData) {
        const parsed = JSON.parse(userData);
        setUsername(parsed.username || '');
      }
      if (imageUri) setProfileImage(imageUri);
    };

    loadUserData();
  }, []);

  const atualizarSenha = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (!email) return;

    const userData = await AsyncStorage.getItem(`user:${email}`);
    if (userData) {
      const parsed = JSON.parse(userData);
      const updated = { ...parsed, senha: novaSenha };
      await AsyncStorage.setItem(`user:${email}`, JSON.stringify(updated));
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      setNovaSenha('');
      setConfirmarSenha('');
    }
  };

  const atualizarNome = async () => {
    if (!username.trim()) {
      Alert.alert('Erro', 'O nome de usuário não pode estar vazio.');
      return;
    }

    if (!email) return;

    const userData = await AsyncStorage.getItem(`user:${email}`);
    if (userData) {
      const parsed = JSON.parse(userData);
      const updated = { ...parsed, username };
      await AsyncStorage.setItem(`user:${email}`, JSON.stringify(updated));
      Alert.alert('Sucesso', 'Nome de usuário atualizado com sucesso!');
    }
  };

  const escolherImagem = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permissão negada', 'Habilite o acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      if (email) {
        await AsyncStorage.setItem(`user:${email}:image`, uri);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity onPress={escolherImagem}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/perfil.png')}
            style={styles.avatar}
          />
          <Text style={styles.editarFoto}>Editar foto</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>Nome de usuário:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome de usuário"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={styles.smallButton} onPress={atualizarNome}>
            <Text style={styles.smallButtonText}>Atualizar Nome</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.infoText}>{email || 'Não disponível'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alteração de senha</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Nova senha:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite a nova senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!showNovaSenha}
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TouchableOpacity onPress={() => setShowNovaSenha(!showNovaSenha)}>
              <FontAwesome
                name={showNovaSenha ? 'eye' : 'eye-slash'}
                size={20}
                color="#aaa"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Confirmar senha:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirme a nova senha"
              placeholderTextColor="#aaa"
              secureTextEntry={!showConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}>
              <FontAwesome
                name={showConfirmarSenha ? 'eye' : 'eye-slash'}
                size={20}
                color="#aaa"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={atualizarSenha}>
          <Text style={styles.saveButtonText}>Atualizar Senha</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#121212',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  container: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  editarFoto: {
    textAlign: 'center',
    color: '#aaa',
    textDecorationLine: 'underline',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoText: {
    color: '#ccc',
    fontSize: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 14 : 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#e06666',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  smallButton: {
    backgroundColor: '#444',
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
